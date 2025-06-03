import type { 
  User, 
  DeviceListing, 
  Bid, 
  Transaction, 
  ApiResponse, 
  PaginatedResponse,
  CreateListingFormData,
  WhatsAppLoginFormData,
  OTPVerificationFormData,
  BidFormData,
  ListingFilters,
  BidUpdate
} from '@/types';

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const generateId = () => Math.random().toString(36).substring(2, 15);
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Mock Data
const mockUsers: User[] = [
  {
    id: 'user-1',
    whatsappNumber: '+919876543210',
    firstName: 'Rahul',
    lastName: 'Kumar',
    email: 'rahul@example.com',
    role: 'CLIENT',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    address: {
      street: '123 MG Road',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682001',
      landmark: 'Near Metro Station'
    }
  },
  {
    id: 'user-2',
    whatsappNumber: '+919876543211',
    firstName: 'Priya',
    lastName: 'Nair',
    role: 'VENDOR',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    businessInfo: {
      businessName: 'TechMart Electronics',
      businessType: 'PROPRIETORSHIP',
      panNumber: 'ABCDE1234F',
      businessAddress: {
        street: '456 Commercial Street',
        city: 'Thiruvananthapuram',
        state: 'Kerala',
        pincode: '695001'
      }
    }
  }
];

const mockListings: DeviceListing[] = [
  {
    id: 'listing-1',
    clientId: 'user-1',
    brand: 'Apple',
    model: 'iPhone 13',
    variant: 'Pro Max',
    storageCapacity: '256GB',
    color: 'Graphite',
    condition: 'EXCELLENT',
    askingPrice: 65000,
    photos: [
      {
        id: 'photo-1',
        url: '/mock-images/iphone-front.jpg',
        type: 'FRONT',
        isRequired: true,
        uploadedAt: new Date()
      }
    ],
    imei1: '123456789012345',
    warranty: {
      hasWarranty: true,
      warrantyExpiresAt: new Date('2025-09-15'),
      warrantyType: 'MANUFACTURER'
    },
    status: 'APPROVED',
    adminApproval: {
      status: 'APPROVED',
      reviewedBy: 'admin-1',
      reviewedAt: new Date(),
      comments: 'Device in excellent condition, approved for listing'
    },
    pickupAddress: {
      street: '123 MG Road',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682001'
    },
    bids: [
      {
        id: 'bid-1',
        listingId: 'listing-1',
        vendorId: 'user-2',
        amount: 58000,
        status: 'ACTIVE',
        placedAt: new Date()
      }
    ],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

const mockTransactions: Transaction[] = [];

// Mock API Implementation
export const mockApi = {
  // Authentication
  sendWhatsAppOTP: async (data: WhatsAppLoginFormData): Promise<ApiResponse<{ otpId: string; expiresIn: number }>> => {
    await delay(1500);
    
    const otpId = generateId();
    console.log(`🚀 WhatsApp OTP for ${data.phoneNumber}: ${generateOTP()}`);
    
    return {
      success: true,
      data: {
        otpId,
        expiresIn: 300 // 5 minutes
      },
      message: 'OTP sent successfully to WhatsApp',
      timestamp: new Date()
    };
  },

  verifyOTP: async (data: OTPVerificationFormData): Promise<ApiResponse<{ user: User; accessToken: string }>> => {
    await delay(1000);
    
    // Simulate OTP verification
    if (data.otp === '123456') {
      const user = mockUsers[0]; // Return first user for demo
      return {
        success: true,
        data: {
          user,
          accessToken: `mock-token-${generateId()}`
        },
        message: 'Login successful',
        timestamp: new Date()
      };
    }
    
    return {
      success: false,
      message: 'Invalid OTP. Please try again.',
      error: 'INVALID_OTP',
      timestamp: new Date()
    };
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    await delay(500);
    
    return {
      success: true,
      data: mockUsers[0],
      message: 'User data retrieved',
      timestamp: new Date()
    };
  },

  // Device Listings
  createListing: async (data: CreateListingFormData): Promise<ApiResponse<DeviceListing>> => {
    await delay(2000);
    
    const listing: DeviceListing = {
      id: generateId(),
      clientId: 'user-1',
      brand: data.brand,
      model: data.model,
      variant: data.variant,
      storageCapacity: data.storageCapacity,
      color: data.color,
      condition: data.condition,
      askingPrice: data.askingPrice,
      description: data.description,
      photos: data.photos.map((_, index) => ({
        id: generateId(),
        url: `/mock-uploads/${generateId()}.jpg`,
        type: index === 0 ? 'FRONT' : index === 1 ? 'BACK' : index === 2 ? 'TOP' : 'BOTTOM',
        isRequired: index < 4,
        uploadedAt: new Date()
      })),
      imei1: data.imei1,
      imei2: data.imei2,
      warranty: {
        hasWarranty: data.hasWarranty,
        warrantyExpiresAt: data.warrantyExpiresAt,
        warrantyType: 'MANUFACTURER'
      },
      status: 'PENDING_APPROVAL',
      adminApproval: {
        status: 'PENDING'
      },
      pickupAddress: data.pickupAddress,
      bids: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockListings.push(listing);
    
    return {
      success: true,
      data: listing,
      message: 'Listing created successfully and sent for admin approval',
      timestamp: new Date()
    };
  },

  getListings: async (filters?: ListingFilters): Promise<PaginatedResponse<DeviceListing>> => {
    await delay(800);
    
    let filteredListings = [...mockListings];
    
    // Apply filters
    if (filters?.brand) {
      filteredListings = filteredListings.filter(l => 
        l.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }
    
    if (filters?.condition?.length) {
      filteredListings = filteredListings.filter(l => 
        filters.condition!.includes(l.condition)
      );
    }
    
    if (filters?.priceRange) {
      filteredListings = filteredListings.filter(l => 
        l.askingPrice >= filters.priceRange!.min && 
        l.askingPrice <= filters.priceRange!.max
      );
    }
    
    // Sort
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'PRICE_LOW':
          filteredListings.sort((a, b) => a.askingPrice - b.askingPrice);
          break;
        case 'PRICE_HIGH':
          filteredListings.sort((a, b) => b.askingPrice - a.askingPrice);
          break;
        case 'NEWEST':
          filteredListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }
    
    return {
      success: true,
      data: filteredListings,
      pagination: {
        page: 1,
        limit: 20,
        total: filteredListings.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      message: 'Listings retrieved successfully'
    };
  },

  getListing: async (id: string): Promise<ApiResponse<DeviceListing>> => {
    await delay(500);
    
    const listing = mockListings.find(l => l.id === id);
    
    if (!listing) {
      return {
        success: false,
        message: 'Listing not found',
        error: 'LISTING_NOT_FOUND',
        timestamp: new Date()
      };
    }
    
    return {
      success: true,
      data: listing,
      message: 'Listing retrieved successfully',
      timestamp: new Date()
    };
  },

  // Bidding
  placeBid: async (listingId: string, data: BidFormData): Promise<ApiResponse<{ bid: Bid; newHighestBid: number }>> => {
    await delay(1000);
    
    const listing = mockListings.find(l => l.id === listingId);
    if (!listing) {
      return {
        success: false,
        message: 'Listing not found',
        error: 'LISTING_NOT_FOUND',
        timestamp: new Date()
      };
    }
    
    const bid: Bid = {
      id: generateId(),
      listingId,
      vendorId: 'user-2',
      amount: data.amount,
      status: 'ACTIVE',
      message: data.message,
      placedAt: new Date()
    };
    
    // Mark other bids as outbid
    listing.bids.forEach(b => {
      if (b.amount < data.amount) {
        b.status = 'OUTBID';
      }
    });
    
    listing.bids.push(bid);
    
    return {
      success: true,
      data: {
        bid,
        newHighestBid: data.amount
      },
      message: 'Bid placed successfully',
      timestamp: new Date()
    };
  },

  getUserBids: async (userId: string): Promise<PaginatedResponse<Bid & { listing: DeviceListing }>> => {
    await delay(600);
    
    const userBids = mockListings.flatMap(listing => 
      listing.bids
        .filter(bid => bid.vendorId === userId)
        .map(bid => ({ ...bid, listing }))
    );
    
    return {
      success: true,
      data: userBids,
      pagination: {
        page: 1,
        limit: 20,
        total: userBids.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      message: 'User bids retrieved successfully'
    };
  },

  // Real-time bidding subscription (mock WebSocket)
  subscribeToBidding: (listingId: string, callback: (update: BidUpdate) => void) => {
    const interval = setInterval(() => {
      // Simulate random bid updates
      if (Math.random() > 0.8) {
        const update: BidUpdate = {
          type: 'NEW_BID',
          data: {
            bidId: generateId(),
            amount: Math.floor(Math.random() * 10000) + 50000,
            vendorName: 'Anonymous Vendor',
            timeRemaining: Math.floor(Math.random() * 86400), // Random seconds remaining
            currentHighestBid: Math.floor(Math.random() * 10000) + 55000
          }
        };
        callback(update);
      }
    }, 5000);

    return () => clearInterval(interval);
  },

  // Admin Operations
  approveListing: async (listingId: string, approved: boolean, comments?: string): Promise<ApiResponse<DeviceListing>> => {
    await delay(1500);
    
    const listing = mockListings.find(l => l.id === listingId);
    if (!listing) {
      return {
        success: false,
        message: 'Listing not found',
        error: 'LISTING_NOT_FOUND',
        timestamp: new Date()
      };
    }
    
    listing.status = approved ? 'APPROVED' : 'REJECTED';
    listing.adminApproval = {
      status: approved ? 'APPROVED' : 'REJECTED',
      reviewedBy: 'admin-1',
      reviewedAt: new Date(),
      comments: comments || (approved ? 'Listing approved' : 'Listing rejected')
    };
    
    if (approved) {
      // Start bidding period
      listing.biddingStartsAt = new Date();
      listing.biddingEndsAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      listing.status = 'ACTIVE';
    }
    
    return {
      success: true,
      data: listing,
      message: `Listing ${approved ? 'approved' : 'rejected'} successfully`,
      timestamp: new Date()
    };
  },

  // Agent Operations
  completeVerification: async (transactionId: string, verificationData: any): Promise<ApiResponse<{ finalOffer: number; deductions: any[] }>> => {
    await delay(3000);
    
    const finalOffer = Math.floor(verificationData.bidAmount * 0.9); // 10% deduction for demo
    const deductions = [
      {
        id: generateId(),
        type: 'COSMETIC_DAMAGE',
        description: 'Minor scratches on the back',
        amount: verificationData.bidAmount * 0.05,
        agentNotes: 'Small scratches noted during inspection'
      },
      {
        id: generateId(),
        type: 'MISSING_ACCESSORIES',
        description: 'Original charger not included',
        amount: verificationData.bidAmount * 0.05,
        agentNotes: 'Customer will provide third-party charger'
      }
    ];
    
    return {
      success: true,
      data: {
        finalOffer,
        deductions
      },
      message: 'Verification completed successfully',
      timestamp: new Date()
    };
  }
};

// Export for use in React Query hooks
export default mockApi; 