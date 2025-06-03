// Core User System
export type UserRole = 'ANONYMOUS' | 'CLIENT' | 'VENDOR' | 'AGENT' | 'ADMIN';

export interface User {
  id: string;
  whatsappNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: UserRole;
  isVerified: boolean;
  isApproved: boolean;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  bankDetails?: BankDetails;
  businessInfo?: BusinessInfo;
  address?: Address;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolderName: string;
  upiId?: string;
}

export interface BusinessInfo {
  businessName: string;
  businessType: 'INDIVIDUAL' | 'PROPRIETORSHIP' | 'PARTNERSHIP' | 'PRIVATE_LIMITED';
  gstNumber?: string;
  panNumber: string;
  businessAddress: Address;
  yearEstablished?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

// Device and Listing System
export type DeviceCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
export type ListingStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'BIDDING_CLOSED' | 'COMPLETED' | 'CANCELLED';

export interface DeviceListing {
  id: string;
  clientId: string;
  client?: User;
  
  // Device Information
  brand: string;
  model: string;
  variant: string;
  storageCapacity: string;
  color: string;
  condition: DeviceCondition;
  askingPrice: number;
  
  // Documentation
  photos: DevicePhoto[];
  imei1: string;
  imei2?: string;
  warranty: WarrantyInfo;
  billImage?: string;
  description?: string;
  
  // Listing Management
  status: ListingStatus;
  adminApproval: AdminApproval;
  pickupAddress: Address;
  
  // Bidding
  bids: Bid[];
  acceptedBidId?: string;
  biddingStartsAt?: Date;
  biddingEndsAt?: Date;
  
  // Assignment
  assignedAgentId?: string;
  assignedAgent?: User;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface DevicePhoto {
  id: string;
  url: string;
  type: 'FRONT' | 'BACK' | 'TOP' | 'BOTTOM' | 'PACKAGING' | 'ACCESSORIES';
  isRequired: boolean;
  uploadedAt: Date;
}

export interface WarrantyInfo {
  hasWarranty: boolean;
  warrantyExpiresAt?: Date;
  warrantyCardImage?: string;
  warrantyType?: 'MANUFACTURER' | 'EXTENDED' | 'SELLER';
}

export interface AdminApproval {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: Date;
  comments?: string;
  rejectionReason?: string;
}

// Bidding System
export type BidStatus = 'ACTIVE' | 'OUTBID' | 'WITHDRAWN' | 'ACCEPTED' | 'REJECTED';

export interface Bid {
  id: string;
  listingId: string;
  vendorId: string;
  vendor?: User;
  amount: number;
  status: BidStatus;
  message?: string;
  placedAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
}

export interface BidUpdate {
  type: 'NEW_BID' | 'BID_ACCEPTED' | 'BID_REJECTED' | 'BIDDING_ENDED';
  data: {
    bidId?: string;
    amount?: number;
    vendorName?: string;
    timeRemaining?: number;
    currentHighestBid?: number;
  };
}

// Transaction System
export type TransactionPhase = 'LISTING' | 'BIDDING' | 'VERIFICATION' | 'COMPLETION';
export type TransactionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';

export interface Transaction {
  id: string;
  listingId: string;
  listing?: DeviceListing;
  clientId: string;
  client?: User;
  vendorId: string;
  vendor?: User;
  agentId: string;
  agent?: User;
  
  // Financial Information
  bidAmount: number;
  finalAmount: number;
  platformFee: number;
  agentCommission: number;
  deductions: Deduction[];
  
  // Transaction Flow
  phase: TransactionPhase;
  status: TransactionStatus;
  
  // Verification Process
  agentVerification: AgentVerification;
  otpVerification: OTPVerification;
  
  // Payment Information
  paymentDetails: PaymentDetails;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Deduction {
  id: string;
  type: 'COSMETIC_DAMAGE' | 'FUNCTIONAL_ISSUE' | 'MISSING_ACCESSORIES' | 'WARRANTY_ISSUE' | 'OTHER';
  description: string;
  amount: number;
  imageUrl?: string;
  agentNotes?: string;
}

export interface AgentVerification {
  customerIdVerified: boolean;
  deviceInspected: boolean;
  conditionAssessment: DeviceCondition;
  actualCondition: string;
  verificationPhotos: string[];
  inspectionNotes: string;
  deductionsApplied: Deduction[];
  finalOfferGenerated: boolean;
  customerAccepted: boolean;
  verifiedAt?: Date;
}

export interface OTPVerification {
  otpId: string;
  phoneNumber: string;
  otp: string;
  purpose: 'LOGIN' | 'TRANSACTION_ACCEPT' | 'DEVICE_HANDOVER' | 'PAYMENT_CONFIRM';
  isVerified: boolean;
  expiresAt: Date;
  verifiedAt?: Date;
}

export interface PaymentDetails {
  method: 'UPI' | 'BANK_TRANSFER' | 'CASH';
  transactionId?: string;
  utrNumber?: string;
  paymentDate?: Date;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  failureReason?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message: string;
}

// Form Types
export interface CreateListingFormData {
  // Device Information
  brand: string;
  model: string;
  variant: string;
  storageCapacity: string;
  color: string;
  condition: DeviceCondition;
  askingPrice: number;
  description?: string;
  
  // Documentation
  photos: File[];
  imei1: string;
  imei2?: string;
  billImage?: File;
  warrantyCardImage?: File;
  hasWarranty: boolean;
  warrantyExpiresAt?: Date;
  
  // Pickup Information
  pickupAddress: Address;
  
  // Terms
  acceptedTerms: boolean;
}

export interface WhatsAppLoginFormData {
  phoneNumber: string;
  countryCode: string;
}

export interface OTPVerificationFormData {
  otp: string;
  otpId: string;
}

export interface BidFormData {
  amount: number;
  message?: string;
}

// Filters and Search
export interface ListingFilters {
  brand?: string;
  model?: string;
  condition?: DeviceCondition[];
  priceRange?: {
    min: number;
    max: number;
  };
  location?: {
    city: string;
    radius: number; // in km
  };
  status?: ListingStatus[];
  sortBy?: 'PRICE_LOW' | 'PRICE_HIGH' | 'NEWEST' | 'ENDING_SOON';
}

export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  completedTransactions: number;
  totalEarnings: number;
  pendingPayments: number;
  averageRating: number;
}

// Real-time Events
export type SocketEvent = 
  | { type: 'BID_PLACED'; data: Bid }
  | { type: 'BID_ACCEPTED'; data: { bidId: string; listingId: string } }
  | { type: 'LISTING_APPROVED'; data: { listingId: string } }
  | { type: 'AGENT_ASSIGNED'; data: { transactionId: string; agentId: string } }
  | { type: 'VERIFICATION_COMPLETE'; data: { transactionId: string; finalAmount: number } }
  | { type: 'PAYMENT_RECEIVED'; data: { transactionId: string; amount: number } };

// Error Types
export interface CellflipError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Constants
export const USER_ROLES = {
  ANONYMOUS: 'ANONYMOUS',
  CLIENT: 'CLIENT', 
  VENDOR: 'VENDOR',
  AGENT: 'AGENT',
  ADMIN: 'ADMIN'
} as const;

export const DEVICE_CONDITIONS = {
  EXCELLENT: 'EXCELLENT',
  GOOD: 'GOOD', 
  FAIR: 'FAIR',
  POOR: 'POOR'
} as const;

export const TRANSACTION_PHASES = {
  LISTING: 'LISTING',
  BIDDING: 'BIDDING',
  VERIFICATION: 'VERIFICATION', 
  COMPLETION: 'COMPLETION'
} as const; 