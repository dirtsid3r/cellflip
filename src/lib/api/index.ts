/**
 * Cellflip API Service Layer
 * 
 * This file provides a comprehensive API service layer with mock data for development.
 * Backend developers can replace these mock implementations with real API calls.
 * 
 * Architecture:
 * - Mock data for development/testing
 * - Service functions that mirror expected API endpoints
 * - Type-safe implementations using our defined interfaces
 * - Error handling and loading states
 * - Easy transition to real backend APIs
 */

import { 
  User, 
  UserRole,
  DeviceListing, 
  DeviceCondition,
  Bid, 
  BidStatus,
  Transaction, 
  TransactionStatus,
  ApiResponse,
  DashboardStats
} from '../../types';

import { TestAuthService } from '../test-auth';

// =============================================================================
// API TYPES FOR WHATSAPP-ONLY AUTHENTICATION
// =============================================================================

export interface WhatsAppLoginRequest {
  phoneNumber: string;
}

export interface WhatsAppLoginResponse {
  verificationId: string;
  expiresIn: number; // seconds
  deliveryStatus: 'sent' | 'failed';
}

export interface WhatsAppVerifyRequest {
  verificationId: string;
  otp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  isNewUser: boolean;
}

export interface DashboardData {
  user: User;
  stats: DashboardStats;
  recentTransactions: Transaction[];
  recentDevices: DeviceListing[];
  notifications: any[];
}

// =============================================================================
// MOCK DATA FOR DEVELOPMENT
// =============================================================================

/**
 * Mock users for development and testing
 * Backend developers: Replace with actual user database queries
 */
const mockUsers: User[] = [
  {
    id: 'user_1',
    whatsappNumber: '+919876543210',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.customer@example.com',
    role: 'CLIENT',
    isVerified: true,
    isApproved: true,
    profileImage: '/avatars/john-doe.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
    address: {
      street: '123 Main Street',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682001'
    }
  },
  {
    id: 'agent_1',
    whatsappNumber: '+919876543211',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.agent@techmobiles.com',
    role: 'AGENT',
    isVerified: true,
    isApproved: true,
    profileImage: '/avatars/rajesh-kumar.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
    address: {
      street: '456 Tech Hub',
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      pincode: '695001'
    },
    businessInfo: {
      businessName: 'Tech Mobiles Kerala',
      businessType: 'PRIVATE_LIMITED',
      panNumber: 'ABCDE1234F',
      businessAddress: {
        street: '456 Tech Hub',
        city: 'Thiruvananthapuram',
        state: 'Kerala',
        pincode: '695001'
      }
    }
  },
  {
    id: 'vendor_1',
    whatsappNumber: '+919876543212',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.vendor@devicemart.com',
    role: 'VENDOR',
    isVerified: true,
    isApproved: true,
    profileImage: '/avatars/priya-nair.jpg',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-12-01'),
    address: {
      street: '789 Business Park',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682001'
    },
    businessInfo: {
      businessName: 'Device Mart Kerala',
      businessType: 'PARTNERSHIP',
      panNumber: 'FGHIJ5678K',
      businessAddress: {
        street: '789 Business Park',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682001'
      }
    }
  },
  {
    id: 'admin_1',
    whatsappNumber: '+919876543213',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@cellflip.com',
    role: 'ADMIN',
    isVerified: true,
    isApproved: true,
    profileImage: '/avatars/admin.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
    address: {
      street: 'Cellflip HQ',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682001'
    }
  }
];

/**
 * Mock devices for development
 * Backend developers: Replace with actual device database queries
 */
const mockDevices: DeviceListing[] = [
  {
    id: 'device_1',
    clientId: 'user_1',
    brand: 'Apple',
    model: 'iPhone 14',
    variant: '128GB',
    storageCapacity: '128GB',
    color: 'Blue',
    condition: 'EXCELLENT',
    askingPrice: 65000,
    photos: [],
    imei1: '123456789012345',
    warranty: {
      hasWarranty: true,
      warrantyExpiresAt: new Date('2025-03-15'),
      warrantyType: 'MANUFACTURER'
    },
    status: 'ACTIVE',
    adminApproval: {
      status: 'APPROVED',
      reviewedAt: new Date()
    },
    pickupAddress: {
      street: '123 Main Street',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682001'
    },
    description: 'Excellent condition iPhone 14 in blue. Used for only 6 months.',
    bids: [],
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-01')
  }
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Simulate API delay for realistic testing
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create standardized API response
 */
const createApiResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message: message || 'Request successful',
  timestamp: new Date()
});

/**
 * Create standardized error response
 */
const createErrorResponse = (message: string, error?: string): ApiResponse<any> => ({
  success: false,
  message,
  error,
  timestamp: new Date()
});

/**
 * Normalize phone number to include +91 prefix
 */
const normalizePhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleanNumber = phone.replace(/\D/g, '');
  
  // If number starts with 91, add +
  if (cleanNumber.startsWith('91') && cleanNumber.length === 12) {
    return `+${cleanNumber}`;
  }
  
  // If 10 digits, assume Indian number and add +91
  if (cleanNumber.length === 10) {
    return `+91${cleanNumber}`;
  }
  
  // If already has +91, return as is
  if (phone.startsWith('+91')) {
    return phone;
  }
  
  return phone;
};

// =============================================================================
// AUTHENTICATION SERVICES
// =============================================================================

/**
 * WhatsApp Login - Send OTP
 * Backend developers: Replace with WhatsApp Business API integration
 */
export const loginWithWhatsApp = async (phoneNumber: string): Promise<ApiResponse<WhatsAppLoginResponse>> => {
  try {
    await delay(1000); // Simulate API delay
    
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    console.log('Attempting WhatsApp login for:', normalizedPhone);
    
    // Use test authentication service
    const result = await TestAuthService.loginWithWhatsApp(normalizedPhone);
    
    if (!result.success || !result.data) {
      return createErrorResponse(result.message || 'Login failed');
    }
    
    return createApiResponse({
      verificationId: result.data.verificationId,
      expiresIn: 300, // 5 minutes
      deliveryStatus: 'sent' as const
    }, 'OTP sent successfully to your WhatsApp');
    
  } catch (error) {
    console.error('WhatsApp login error:', error);
    return createErrorResponse('Failed to send verification code. Please try again.');
  }
};

/**
 * WhatsApp OTP Verification
 * Backend developers: Replace with actual OTP verification
 */
export const verifyWhatsAppOTP = async (
  verificationId: string, 
  otp: string
): Promise<ApiResponse<AuthResponse>> => {
  try {
    await delay(1500); // Simulate API delay
    
    console.log('Verifying OTP:', { verificationId, otp });
    
    // Extract phone number from localStorage (for test purposes)
    // In real implementation, this would be stored server-side with verificationId
    const phoneNumber = localStorage.getItem('cellflip_login_phone');
    if (!phoneNumber) {
      return createErrorResponse('Session expired. Please try again.');
    }
    
    // Use test authentication service
    const result = await TestAuthService.verifyWhatsAppOTP(verificationId, otp, phoneNumber);
    
    if (!result.success) {
      return createErrorResponse(result.message || 'OTP verification failed');
    }

    if (!result.data) {
      return createErrorResponse('Authentication failed.');
    }
    
    const { user, token } = result.data;
    
    // Convert TestUser to User format
    const formattedUser: User = {
      id: user.id,
      whatsappNumber: user.whatsappNumber,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ').slice(1).join(' '),
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isApproved: true,
      profileImage: user.profilePicture,
      createdAt: new Date(),
      updatedAt: new Date(),
      address: user.clientData?.address || user.vendorData?.address || {
        street: '',
        city: '',
        state: 'Kerala',
        pincode: ''
      },
      ...(user.vendorData && {
        businessInfo: {
          businessName: user.vendorData.businessName,
          businessType: 'PRIVATE_LIMITED',
          panNumber: 'ABCDE1234F',
          businessAddress: user.vendorData.address
        }
      })
    };
    
    return createApiResponse({
      user: formattedUser,
      token,
      refreshToken: `refresh_${token}`,
      isNewUser: false
    }, 'Login successful');
    
  } catch (error) {
    console.error('OTP verification error:', error);
    return createErrorResponse('Failed to verify OTP. Please try again.');
  }
};

// Store phone number for OTP verification (test helper)
export const storeLoginPhone = (phoneNumber: string) => {
  localStorage.setItem('cellflip_login_phone', normalizePhoneNumber(phoneNumber));
};

/**
 * Get Dashboard Data
 * Backend developers: Replace with actual dashboard API calls
 */
export const getDashboardData = async (userId: string): Promise<ApiResponse<DashboardData>> => {
  try {
    await delay(500);
    
    const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
    
    const stats: DashboardStats = {
      totalListings: 5,
      activeListings: 2,
      completedTransactions: 3,
      totalEarnings: 185000,
      pendingPayments: 25000,
      averageRating: 4.8
    };
    
    return createApiResponse({
      user,
      stats,
      recentTransactions: [],
      recentDevices: mockDevices,
      notifications: []
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return createErrorResponse('Failed to load dashboard data');
  }
};

// =============================================================================
// DEVICE SERVICES
// =============================================================================

/**
 * Submit Device for Listing
 * Backend developers: Replace with actual device submission API
 */
export const submitDeviceForListing = async (deviceData: any): Promise<ApiResponse<DeviceListing>> => {
  try {
    await delay(2000);
    
    const newDevice: DeviceListing = {
      id: `device_${Date.now()}`,
      clientId: deviceData.clientId || 'user_1',
      brand: deviceData.brand,
      model: deviceData.model,
      variant: deviceData.variant,
      storageCapacity: deviceData.storageCapacity,
      color: deviceData.color,
      condition: deviceData.condition,
      askingPrice: deviceData.askingPrice,
      photos: deviceData.photos || [],
      imei1: deviceData.imei1,
      imei2: deviceData.imei2,
      warranty: deviceData.warranty,
      status: 'PENDING_APPROVAL',
      adminApproval: {
        status: 'PENDING',
        reviewedAt: undefined
      },
      pickupAddress: deviceData.pickupAddress,
      description: deviceData.description,
      bids: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return createApiResponse(newDevice, 'Device submitted successfully! It will be reviewed by our team.');
  } catch (error) {
    console.error('Device submission error:', error);
    return createErrorResponse('Failed to submit device for listing');
  }
};

// =============================================================================
// EXPORT API SERVICE
// =============================================================================

export const apiService = {
  // Authentication
  loginWithWhatsApp,
  verifyWhatsAppOTP,
  storeLoginPhone,
  
  // Dashboard
  getDashboardData,
  
  // Devices
  submitDeviceForListing
}; 