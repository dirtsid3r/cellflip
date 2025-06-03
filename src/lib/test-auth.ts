// Test Authentication Service for Cellflip
// This provides pre-configured accounts for testing all user flows

export interface TestUser {
  id: string;
  name: string;
  role: 'CLIENT' | 'VENDOR' | 'AGENT' | 'ADMIN';
  whatsappNumber: string;
  email: string;
  isVerified: boolean;
  profilePicture?: string;
  // Role-specific data
  clientData?: {
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      landmark?: string;
    };
    totalListings: number;
    completedTransactions: number;
  };
  vendorData?: {
    businessName: string;
    businessType: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
    rating: number;
    totalPurchases: number;
    verificationStatus: string;
  };
  agentData?: {
    agentId: string;
    location: {
      city: string;
      state: string;
    };
    rating: number;
    totalPickups: number;
    activePickups: number;
    availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
    earnings: number;
  };
}

export const TEST_ACCOUNTS: TestUser[] = [
  // CLIENT ACCOUNT
  {
    id: 'client_001',
    name: 'Rajesh Kumar',
    role: 'CLIENT',
    whatsappNumber: '+919876543210',
    email: 'rajesh.kumar@example.com',
    isVerified: true,
    profilePicture: '/avatars/rajesh.jpg',
    clientData: {
      address: {
        street: 'TC 15/2890, Pattoor Road, Near Medical College',
        city: 'Thiruvananthapuram',
        state: 'Kerala',
        pincode: '695011',
        landmark: 'Opposite Sree Chitra Hospital'
      },
      totalListings: 3,
      completedTransactions: 2
    }
  },

  // VENDOR ACCOUNT
  {
    id: 'vendor_001',
    name: 'Suresh Menon',
    role: 'VENDOR',
    whatsappNumber: '+919876543211',
    email: 'suresh@mobilepalace.com',
    isVerified: true,
    profilePicture: '/avatars/suresh.jpg',
    vendorData: {
      businessName: 'Mobile Palace Thrissur',
      businessType: 'Electronics Retailer',
      address: {
        street: 'Shop No. 45, Swaraj Round, Round South',
        city: 'Thrissur',
        state: 'Kerala',
        pincode: '680001'
      },
      rating: 4.8,
      totalPurchases: 142,
      verificationStatus: 'VERIFIED'
    }
  },

  // AGENT ACCOUNT
  {
    id: 'agent_001',
    name: 'Priya Nair',
    role: 'AGENT',
    whatsappNumber: '+919876543212',
    email: 'priya.nair@cellflip.com',
    isVerified: true,
    profilePicture: '/avatars/priya.jpg',
    agentData: {
      agentId: 'AG001',
      location: {
        city: 'Thiruvananthapuram',
        state: 'Kerala'
      },
      rating: 4.9,
      totalPickups: 156,
      activePickups: 2,
      availability: 'AVAILABLE',
      earnings: 45600
    }
  },

  // ADMIN ACCOUNT
  {
    id: 'admin_001',
    name: 'Admin User',
    role: 'ADMIN',
    whatsappNumber: '+919876543213',
    email: 'admin@cellflip.com',
    isVerified: true,
    profilePicture: '/avatars/admin.jpg'
  }
];

// Quick login credentials for testing
export const TEST_CREDENTIALS = {
  // Phone numbers that will auto-login (skip OTP)
  QUICK_LOGIN: {
    '+919876543210': 'client_001',    // Client - Rajesh Kumar
    '+919876543211': 'vendor_001',    // Vendor - Suresh Menon  
    '+919876543212': 'agent_001',     // Agent - Priya Nair
    '+919876543213': 'admin_001',     // Admin User
  },
  // Valid OTP for all accounts
  VALID_OTP: '123456'
};

export class TestAuthService {
  static findUserByPhone(phoneNumber: string): TestUser | null {
    const userId = TEST_CREDENTIALS.QUICK_LOGIN[phoneNumber as keyof typeof TEST_CREDENTIALS.QUICK_LOGIN];
    if (!userId) return null;
    
    return TEST_ACCOUNTS.find(user => user.id === userId) || null;
  }

  static verifyOTP(otp: string): boolean {
    return otp === TEST_CREDENTIALS.VALID_OTP;
  }

  static async loginWithWhatsApp(phoneNumber: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = this.findUserByPhone(phoneNumber);
    if (!user) {
      return {
        success: false,
        message: 'Phone number not registered. Please sign up first.'
      };
    }

    return {
      success: true,
      data: {
        verificationId: `verify_${Date.now()}`,
        message: 'OTP sent successfully'
      }
    };
  }

  static async verifyWhatsAppOTP(verificationId: string, otp: string, phoneNumber: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!this.verifyOTP(otp)) {
      return {
        success: false,
        message: 'Invalid OTP. Please try again.'
      };
    }

    const user = this.findUserByPhone(phoneNumber);
    if (!user) {
      return {
        success: false,
        message: 'User not found.'
      };
    }

    return {
      success: true,
      data: {
        user,
        token: `test_token_${user.id}_${Date.now()}`
      }
    };
  }

  static async registerUser(userData: {
    name: string;
    phoneNumber: string;
    role: 'CLIENT' | 'VENDOR' | 'AGENT';
    email?: string;
  }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if user already exists
    const existingUser = this.findUserByPhone(userData.phoneNumber);
    if (existingUser) {
      return {
        success: false,
        message: 'User already exists with this phone number.'
      };
    }

    // Create new user
    const newUser: TestUser = {
      id: `${userData.role.toLowerCase()}_${Date.now()}`,
      name: userData.name,
      role: userData.role,
      whatsappNumber: userData.phoneNumber,
      email: userData.email || `${userData.name.toLowerCase().replace(' ', '.')}@example.com`,
      isVerified: false,
      // Add role-specific default data
      ...(userData.role === 'CLIENT' && {
        clientData: {
          address: {
            street: '',
            city: '',
            state: 'Kerala',
            pincode: ''
          },
          totalListings: 0,
          completedTransactions: 0
        }
      }),
      ...(userData.role === 'VENDOR' && {
        vendorData: {
          businessName: '',
          businessType: '',
          address: {
            street: '',
            city: '',
            state: 'Kerala',
            pincode: ''
          },
          rating: 0,
          totalPurchases: 0,
          verificationStatus: 'PENDING'
        }
      }),
      ...(userData.role === 'AGENT' && {
        agentData: {
          agentId: `AG${Date.now().toString().slice(-3)}`,
          location: {
            city: '',
            state: 'Kerala'
          },
          rating: 0,
          totalPickups: 0,
          activePickups: 0,
          availability: 'OFFLINE',
          earnings: 0
        }
      })
    };

    // In a real app, this would be saved to database
    // For testing, we'll add to our test accounts
    TEST_ACCOUNTS.push(newUser);

    return {
      success: true,
      data: {
        user: newUser,
        token: `test_token_${newUser.id}_${Date.now()}`
      }
    };
  }
}

// Mock transaction data for testing flows
export const MOCK_TRANSACTIONS = [
  {
    id: 'txn_001',
    listing: {
      id: 'listing_001',
      brand: 'Apple',
      model: 'iPhone 14',
      variant: '128GB',
      condition: 'EXCELLENT',
      askingPrice: 65000,
      imei1: '123456789012345',
      imei2: '123456789012346',
      photos: ['/devices/iphone14-1.jpg', '/devices/iphone14-2.jpg'],
      description: 'Excellent condition iPhone 14, barely used for 6 months.'
    },
    client: TEST_ACCOUNTS[0], // Rajesh Kumar
    vendor: TEST_ACCOUNTS[1], // Suresh Menon
    agent: TEST_ACCOUNTS[2],  // Priya Nair
    status: 'APPROVED',
    winningBid: {
      amount: 58000,
      placedAt: '2024-12-09T16:30:00Z'
    },
    bids: [
      {
        id: 'bid_001',
        vendorId: 'vendor_001',
        vendorName: 'Mobile Palace Thrissur',
        amount: 58000,
        placedAt: '2024-12-09T16:30:00Z',
        status: 'WINNING'
      },
      {
        id: 'bid_002', 
        vendorId: 'vendor_002',
        vendorName: 'Smart Mobile World',
        amount: 56000,
        placedAt: '2024-12-09T15:45:00Z',
        status: 'OUTBID'
      }
    ],
    scheduledPickup: '2024-12-10T14:00:00Z',
    createdAt: '2024-12-08T10:00:00Z'
  }
];

// Test helper functions
export const testHelpers = {
  // Quick login for testing
  quickLogin: (phoneNumber: string) => {
    const user = TestAuthService.findUserByPhone(phoneNumber);
    if (user) {
      localStorage.setItem('cellflip_user', JSON.stringify(user));
      localStorage.setItem('cellflip_auth_token', `test_token_${user.id}`);
      return user;
    }
    return null;
  },

  // Clear auth data
  logout: () => {
    localStorage.removeItem('cellflip_user');
    localStorage.removeItem('cellflip_auth_token');
  },

  // Get current user
  getCurrentUser: (): TestUser | null => {
    const userData = localStorage.getItem('cellflip_user');
    return userData ? JSON.parse(userData) : null;
  }
}; 