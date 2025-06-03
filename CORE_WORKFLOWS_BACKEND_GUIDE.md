# Cellflip Core Workflows - Backend Implementation Guide

## Overview
This document provides comprehensive backend implementation guidance for all core user flows in the Cellflip platform.

## 🔄 **Complete Transaction Lifecycle**

### Flow Diagram
```
Client Lists Device → Admin Approval → Vendor Bidding → Agent Assignment → 
Device Pickup → Agent Verification → Device Delivery → Vendor Receipt → 
Payment Processing → Transaction Complete
```

---

## 🚚 **1. Agent Pickup Workflow**

### Route: `/agent/pickup/[transactionId]`

#### **API Endpoints Required:**

##### **GET /api/agent/transactions/{transactionId}/pickup**
```typescript
interface PickupTransactionResponse {
  id: string;
  listing: {
    id: string;
    brand: string;
    model: string;
    variant: string;
    condition: DeviceCondition;
    askingPrice: number;
    imei1: string;
    imei2?: string;
    photos: string[];
    description: string;
  };
  client: {
    id: string;
    name: string;
    whatsappNumber: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      landmark?: string;
    };
  };
  vendor: {
    id: string;
    name: string;
    businessName: string;
    whatsappNumber: string;
  };
  winningBid: {
    amount: number;
    placedAt: string;
  };
  status: string;
  scheduledAt: string;
  assignedAt: string;
}
```

##### **POST /api/agent/transactions/{transactionId}/verification**
```typescript
interface VerificationSubmission {
  // Customer Identity
  customerIdVerified: boolean;
  idType: 'AADHAAR' | 'PAN' | 'DRIVING_LICENSE';
  idNumber: string;
  idDocumentPhoto: string; // Base64 or file URL
  
  // Device Inspection
  actualCondition: DeviceCondition;
  inspectionNotes: string;
  functionalIssues: string[];
  physicalIssues: string[];
  accessoriesIncluded: string[];
  batteryHealth: number;
  
  // Verification Photos
  devicePhotos: string[]; // Array of 4 photos
  billPhoto?: string;
  packagingPhoto?: string;
  
  // Deductions & Final Offer
  deductions: Array<{
    id: string;
    category: 'COSMETIC_DAMAGE' | 'FUNCTIONAL_ISSUE' | 'MISSING_ACCESSORIES' | 'CONDITION_MISMATCH' | 'OTHER';
    description: string;
    amount: number;
    severity: 'MINOR' | 'MODERATE' | 'MAJOR';
  }>;
  finalOffer: number;
}

interface VerificationResponse {
  success: boolean;
  transactionId: string;
  finalOffer: number;
  otpSentToClient: boolean;
  message: string;
}
```

#### **WhatsApp Integration:**
```typescript
// Send OTP to client for final offer acceptance
const whatsappMessage = {
  to: client.whatsappNumber,
  type: 'otp',
  template: 'transaction_completion_otp',
  data: {
    customerName: client.name,
    deviceDetails: `${listing.brand} ${listing.model}`,
    finalOffer: verification.finalOffer,
    deductions: verification.deductions.length > 0 ? verification.deductions : null,
    otp: generateOTP(6),
    expiryMinutes: 10
  }
};
```

#### **Database Schema:**
```sql
-- Device Verification Table
CREATE TABLE device_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    agent_id UUID REFERENCES users(id),
    
    -- Customer Identity
    customer_id_verified BOOLEAN NOT NULL,
    id_type VARCHAR(20) NOT NULL,
    id_number VARCHAR(50) NOT NULL,
    id_document_photo_url TEXT,
    
    -- Device Inspection
    actual_condition VARCHAR(20) NOT NULL,
    inspection_notes TEXT,
    functional_issues JSONB DEFAULT '[]',
    physical_issues JSONB DEFAULT '[]',
    accessories_included JSONB DEFAULT '[]',
    battery_health INTEGER,
    
    -- Photos
    device_photos JSONB NOT NULL, -- Array of photo URLs
    bill_photo_url TEXT,
    packaging_photo_url TEXT,
    
    -- Financial
    original_bid_amount DECIMAL(10,2) NOT NULL,
    total_deductions DECIMAL(10,2) DEFAULT 0,
    final_offer DECIMAL(10,2) NOT NULL,
    deductions JSONB DEFAULT '[]',
    
    -- Status & Timestamps
    verification_status VARCHAR(20) DEFAULT 'PENDING',
    verified_at TIMESTAMP,
    customer_accepted_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Deductions Table
CREATE TABLE verification_deductions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id UUID REFERENCES device_verifications(id),
    category VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    severity VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚛 **2. Agent Delivery Workflow**

### Route: `/agent/delivery/[transactionId]`

#### **API Endpoints Required:**

##### **GET /api/agent/transactions/{transactionId}/delivery**
```typescript
interface DeliveryTransactionResponse {
  id: string;
  listing: {
    id: string;
    brand: string;
    model: string;
    variant: string;
    finalCondition: string;
    inspectionPhotos: string[];
    finalOffer: number;
    deductions: number;
    originalBid: number;
  };
  client: {
    id: string;
    name: string;
    whatsappNumber: string;
  };
  vendor: {
    id: string;
    name: string;
    businessName: string;
    whatsappNumber: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      landmark?: string;
    };
    rating: number;
    totalPurchases: number;
  };
  agent: {
    id: string;
    name: string;
    earnings: number;
    commission: number;
  };
  status: string;
  pickupCompletedAt: string;
  estimatedDeliveryTime: string;
}
```

##### **POST /api/agent/transactions/{transactionId}/delivery-complete**
```typescript
interface DeliverySubmission {
  vendorIdVerified: boolean;
  vendorIdPhoto: string;
  handoverPhoto: string;
  deliveryNotes: string;
}

interface DeliveryResponse {
  success: boolean;
  transactionId: string;
  vendorOtpSent: boolean;
  clientOtpSent: boolean;
  message: string;
}
```

#### **Dual OTP Process:**
```typescript
// 1. Vendor Receipt Confirmation
const vendorOtpMessage = {
  to: vendor.whatsappNumber,
  type: 'otp',
  template: 'vendor_receipt_confirmation',
  data: {
    vendorName: vendor.name,
    deviceDetails: `${listing.brand} ${listing.model}`,
    finalAmount: listing.finalOffer,
    agentName: agent.name,
    otp: generateOTP(6),
    expiryMinutes: 5
  }
};

// 2. Client Final Confirmation (after vendor OTP)
const clientOtpMessage = {
  to: client.whatsappNumber,
  type: 'otp',
  template: 'transaction_final_confirmation',
  data: {
    clientName: client.name,
    deviceDetails: `${listing.brand} ${listing.model}`,
    finalAmount: listing.finalOffer,
    vendorName: vendor.businessName,
    otp: generateOTP(6),
    expiryMinutes: 5
  }
};
```

#### **Database Schema:**
```sql
-- Device Deliveries Table
CREATE TABLE device_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    verification_id UUID REFERENCES device_verifications(id),
    agent_id UUID REFERENCES users(id),
    vendor_id UUID REFERENCES users(id),
    
    -- Vendor Verification
    vendor_id_verified BOOLEAN NOT NULL,
    vendor_id_photo_url TEXT,
    handover_photo_url TEXT NOT NULL,
    delivery_notes TEXT,
    
    -- Confirmation Status
    vendor_confirmed_at TIMESTAMP,
    vendor_otp_verified BOOLEAN DEFAULT FALSE,
    client_confirmed_at TIMESTAMP,
    client_otp_verified BOOLEAN DEFAULT FALSE,
    
    -- Delivery Tracking
    delivery_status VARCHAR(20) DEFAULT 'IN_TRANSIT',
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 👨‍💼 **3. Admin Agent Assignment**

### Component: `AdminAgentAssignment`

#### **API Endpoints Required:**

##### **GET /api/admin/agents/available**
```typescript
interface AvailableAgentsRequest {
  pickupLocation: {
    city: string;
    state: string;
    pincode: string;
  };
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
  scheduledTime?: string;
}

interface AgentResponse {
  id: string;
  name: string;
  whatsappNumber: string;
  email: string;
  rating: number;
  totalPickups: number;
  activePickups: number;
  location: {
    city: string;
    state: string;
  };
  availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  distance?: number; // km from pickup location
  estimatedTime?: number; // minutes to reach
  workingHours: {
    start: string; // "09:00"
    end: string;   // "18:00"
  };
}
```

##### **POST /api/admin/transactions/{transactionId}/assign-agent**
```typescript
interface AgentAssignmentRequest {
  agentId: string;
  scheduledDateTime: string; // ISO format
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  notes?: string;
}

interface AgentAssignmentResponse {
  success: boolean;
  transactionId: string;
  agentId: string;
  scheduledDateTime: string;
  notificationSent: boolean;
  message: string;
}
```

#### **WhatsApp Notifications:**
```typescript
// Notify Agent of Assignment
const agentNotification = {
  to: agent.whatsappNumber,
  type: 'assignment',
  template: 'pickup_assignment',
  data: {
    agentName: agent.name,
    deviceDetails: `${transaction.listing.brand} ${transaction.listing.model}`,
    clientName: transaction.client.name,
    pickupAddress: transaction.client.address,
    scheduledTime: assignment.scheduledDateTime,
    priority: assignment.priority,
    earnings: calculateAgentCommission(transaction.vendor.winningBid),
    notes: assignment.notes
  }
};

// Notify Client of Assigned Agent
const clientNotification = {
  to: client.whatsappNumber,
  type: 'assignment',
  template: 'agent_assigned',
  data: {
    clientName: client.name,
    agentName: agent.name,
    agentPhone: agent.whatsappNumber,
    scheduledTime: assignment.scheduledDateTime,
    deviceDetails: `${transaction.listing.brand} ${transaction.listing.model}`
  }
};
```

#### **Database Schema:**
```sql
-- Agent Assignments Table
CREATE TABLE agent_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    agent_id UUID REFERENCES users(id),
    assigned_by_admin_id UUID REFERENCES users(id),
    
    -- Assignment Details
    scheduled_pickup_time TIMESTAMP NOT NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'NORMAL',
    assignment_notes TEXT,
    
    -- Status Tracking
    assignment_status VARCHAR(20) DEFAULT 'ASSIGNED',
    agent_accepted_at TIMESTAMP,
    agent_started_at TIMESTAMP,
    pickup_completed_at TIMESTAMP,
    delivery_completed_at TIMESTAMP,
    
    -- Performance Metrics
    estimated_duration_minutes INTEGER,
    actual_duration_minutes INTEGER,
    distance_km DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent Location Tracking
CREATE TABLE agent_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES users(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    accuracy_meters INTEGER,
    recorded_at TIMESTAMP DEFAULT NOW(),
    
    -- For route optimization
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10)
);
```

---

## 💳 **4. Payment Processing Integration**

#### **Payment Flow API:**
```typescript
interface PaymentProcessingRequest {
  transactionId: string;
  clientPayment: {
    amount: number;
    method: 'UPI' | 'BANK_TRANSFER' | 'WALLET';
    recipient: string; // Client bank account/UPI
  };
  vendorPayment: {
    amount: number;
    method: 'UPI' | 'BANK_TRANSFER' | 'WALLET';
    recipient: string; // Vendor bank account/UPI
  };
  agentCommission: {
    amount: number;
    agentId: string;
  };
  platformFee: {
    amount: number;
  };
}

interface PaymentProcessingResponse {
  success: boolean;
  transactionId: string;
  paymentIds: {
    clientPaymentId: string;
    vendorPaymentId: string;
    agentCommissionId: string;
  };
  estimatedSettlementTime: string; // "24 hours"
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
}
```

#### **Payment Gateway Integration:**
```typescript
// Razorpay/UPI Integration Example
const processPayments = async (paymentData: PaymentProcessingRequest) => {
  const results = await Promise.allSettled([
    // Client receives payment
    razorpay.transfers.create({
      account: paymentData.clientPayment.recipient,
      amount: paymentData.clientPayment.amount * 100, // Convert to paise
      currency: 'INR',
      notes: {
        transactionId: paymentData.transactionId,
        type: 'CLIENT_PAYMENT'
      }
    }),
    
    // Agent receives commission
    razorpay.transfers.create({
      account: paymentData.agentCommission.recipient,
      amount: paymentData.agentCommission.amount * 100,
      currency: 'INR',
      notes: {
        transactionId: paymentData.transactionId,
        type: 'AGENT_COMMISSION'
      }
    })
  ]);
  
  // Platform fee is retained automatically
  return results;
};
```

---

## 📱 **5. WhatsApp Business API Integration**

#### **Required Templates:**

##### **OTP Templates:**
```typescript
const OTP_TEMPLATES = {
  TRANSACTION_COMPLETION: {
    name: 'transaction_completion_otp',
    category: 'AUTHENTICATION',
    components: [
      {
        type: 'BODY',
        text: 'Hi {{1}}, confirm your {{2}} transaction of ₹{{3}}. Your OTP: {{4}}. Valid for {{5}} minutes.'
      }
    ]
  },
  
  VENDOR_RECEIPT_CONFIRMATION: {
    name: 'vendor_receipt_confirmation',
    category: 'AUTHENTICATION', 
    components: [
      {
        type: 'BODY',
        text: 'Hi {{1}}, confirm receipt of {{2}} from agent {{3}}. Amount: ₹{{4}}. Your OTP: {{5}}. Valid for {{6}} minutes.'
      }
    ]
  },
  
  USER_VERIFICATION: {
    name: 'user_verification_otp',
    category: 'AUTHENTICATION',
    components: [
      {
        type: 'BODY', 
        text: 'Welcome to Cellflip! Your verification OTP: {{1}}. Valid for {{2}} minutes.'
      }
    ]
  }
};
```

##### **Notification Templates:**
```typescript
const NOTIFICATION_TEMPLATES = {
  PICKUP_ASSIGNMENT: {
    name: 'pickup_assignment',
    category: 'TRANSACTIONAL',
    components: [
      {
        type: 'BODY',
        text: 'New pickup assigned! Device: {{1}}, Client: {{2}}, Time: {{3}}, Location: {{4}}. Commission: ₹{{5}}'
      }
    ]
  },
  
  AGENT_ASSIGNED: {
    name: 'agent_assigned', 
    category: 'TRANSACTIONAL',
    components: [
      {
        type: 'BODY',
        text: 'Agent {{1}} assigned for your {{2}} pickup on {{3}}. Contact: {{4}}'
      }
    ]
  }
};
```

#### **WebSocket Events for Real-time Updates:**
```typescript
interface WebSocketEvents {
  // Agent Location Updates
  'agent:location': {
    agentId: string;
    latitude: number;
    longitude: number;
    transactionId?: string;
  };
  
  // Transaction Status Updates
  'transaction:status': {
    transactionId: string;
    status: string;
    timestamp: string;
    metadata?: any;
  };
  
  // OTP Verification Events
  'otp:verified': {
    phone: string;
    purpose: string;
    transactionId?: string;
    timestamp: string;
  };
  
  // Payment Status Updates
  'payment:processed': {
    transactionId: string;
    paymentType: 'CLIENT' | 'VENDOR' | 'AGENT_COMMISSION';
    amount: number;
    status: 'SUCCESS' | 'FAILED';
  };
}
```

---

## 🔐 **6. Security & Validation**

#### **OTP Security:**
```typescript
interface OtpConfig {
  length: 6;
  expiryMinutes: 10;
  maxAttempts: 3;
  cooldownMinutes: 30; // After max attempts
  rateLimit: {
    maxRequestsPerHour: 10;
    maxRequestsPerDay: 50;
  };
}

const validateOtp = async (phone: string, otp: string, purpose: string) => {
  const stored = await redis.get(`otp:${phone}:${purpose}`);
  if (!stored) throw new Error('OTP expired or not found');
  
  const { code, attempts, expiresAt } = JSON.parse(stored);
  
  if (Date.now() > expiresAt) {
    await redis.del(`otp:${phone}:${purpose}`);
    throw new Error('OTP expired');
  }
  
  if (attempts >= 3) {
    throw new Error('Max attempts exceeded');
  }
  
  if (code !== otp) {
    await redis.set(`otp:${phone}:${purpose}`, JSON.stringify({
      ...JSON.parse(stored),
      attempts: attempts + 1
    }));
    throw new Error('Invalid OTP');
  }
  
  await redis.del(`otp:${phone}:${purpose}`);
  return true;
};
```

#### **File Upload Security:**
```typescript
interface FileUploadConfig {
  maxSize: 5 * 1024 * 1024; // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'];
  virusScan: true;
  encryption: true;
  storageLocation: 'S3' | 'CLOUDINARY';
}

const validateImageUpload = (file: File) => {
  if (file.size > FileUploadConfig.maxSize) {
    throw new Error('File too large');
  }
  
  if (!FileUploadConfig.allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  // Additional validation: Image dimensions, metadata checks
  return true;
};
```

---

## 📊 **7. Database Indexes & Performance**

#### **Critical Indexes:**
```sql
-- Transaction Performance
CREATE INDEX idx_transactions_status_created ON transactions(status, created_at DESC);
CREATE INDEX idx_transactions_client_id ON transactions(client_id);
CREATE INDEX idx_transactions_vendor_id ON transactions(vendor_id);

-- Agent Performance  
CREATE INDEX idx_agent_assignments_agent_status ON agent_assignments(agent_id, assignment_status);
CREATE INDEX idx_agent_assignments_scheduled_time ON agent_assignments(scheduled_pickup_time);
CREATE INDEX idx_agent_locations_agent_time ON agent_locations(agent_id, recorded_at DESC);

-- Verification Performance
CREATE INDEX idx_device_verifications_transaction ON device_verifications(transaction_id);
CREATE INDEX idx_device_verifications_agent_status ON device_verifications(agent_id, verification_status);

-- Payment Performance
CREATE INDEX idx_payments_transaction_type ON payments(transaction_id, payment_type);
CREATE INDEX idx_payments_status_created ON payments(status, created_at DESC);
```

---

## 🚀 **8. Deployment & Monitoring**

#### **Environment Variables:**
```env
# WhatsApp Business API
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_verify_token

# Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# File Storage
AWS_S3_BUCKET=cellflip-uploads
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1

# Database
DATABASE_URL=postgresql://user:password@host:port/cellflip
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your_jwt_secret
OTP_SECRET=your_otp_secret
ENCRYPTION_KEY=your_32_char_encryption_key
```

#### **Monitoring Metrics:**
```typescript
const CRITICAL_METRICS = {
  // Transaction Flow
  'transaction.pickup.completion_rate': 'percentage',
  'transaction.delivery.completion_rate': 'percentage', 
  'transaction.average_duration': 'hours',
  
  // Agent Performance
  'agent.pickup.average_time': 'minutes',
  'agent.verification.accuracy': 'percentage',
  'agent.availability.percentage': 'percentage',
  
  // Payment Success
  'payment.success_rate': 'percentage',
  'payment.settlement_time': 'hours',
  
  // OTP & Security
  'otp.delivery_rate': 'percentage',
  'otp.verification_success_rate': 'percentage',
  'security.failed_attempts': 'count'
};
```

This implementation guide provides the complete backend foundation for all core Cellflip workflows. Each section includes proper error handling, security measures, and performance optimizations needed for production deployment. 