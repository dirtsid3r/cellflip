# Cellflip Backend Integration Guide

## 🎯 **Integration Strategy**

This document provides backend developers with everything needed to implement real APIs that integrate seamlessly with the existing frontend.

## 📋 **Quick Start Checklist**

- [ ] Set up development environment with provided .env template
- [ ] Review all TypeScript interfaces in `/src/types/`
- [ ] Test frontend with MSW mocks to understand expected behavior
- [ ] Implement APIs one module at a time using provided contracts
- [ ] Test integration by swapping MSW handlers for real endpoints

## 🔌 **Critical Integration Points**

### **1. WhatsApp Business API Integration**

**Requirements:**
```yaml
WhatsApp Business API Setup:
  - Business verification required
  - Webhook URL for delivery status
  - Template messages pre-approved
  - Rate limiting: 1000 messages/day initially
  
OTP Flow:
  POST /api/whatsapp/send-otp:
    rate_limit: 1 request per 60 seconds per phone
    template: "Your Cellflip verification code is {{1}}. Valid for 5 minutes."
    fallback: SMS via backup provider if WhatsApp fails
    
  POST /api/whatsapp/verify-otp:
    validation: 6-digit numeric code
    expiry: 5 minutes
    max_attempts: 3 per session
```

**Error Handling:**
```typescript
// Frontend expects these error codes
interface WhatsAppError {
  code: 'RATE_LIMITED' | 'INVALID_NUMBER' | 'DELIVERY_FAILED' | 'EXPIRED' | 'INVALID_OTP'
  message: string
  retryAfter?: number // seconds until next attempt allowed
}
```

### **2. File Upload System**

**Current Frontend Implementation:**
```typescript
// Frontend sends files as multipart/form-data
const uploadFiles = async (files: File[]) => {
  const formData = new FormData()
  files.forEach((file, idx) => {
    formData.append(`photo_${idx}`, file)
  })
  // Expects JSON response with file URLs
}
```

**Backend Requirements:**
```yaml
File Storage:
  - Max file size: 10MB per image
  - Accepted formats: JPEG, PNG, WebP
  - Image compression: Auto-resize to 1920x1080 max
  - Storage: AWS S3 or similar with CDN
  - Security: Signed URLs for access
  
Response Format:
  POST /api/files/upload:
    response:
      files:
        - id: "file_123"
          url: "https://cdn.cellflip.com/images/file_123.jpg"
          thumbnail: "https://cdn.cellflip.com/thumbnails/file_123.jpg"
          type: "device_photo"
```

### **3. Real-time Updates (WebSocket)**

**Frontend Implementation:**
```typescript
// Current socket.io client setup
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  auth: { token: authToken }
})

// Listening for these events:
socket.on('bid_placed', handleBidUpdate)
socket.on('listing_approved', handleListingApproval)
socket.on('agent_assigned', handleAgentAssignment)
```

**Backend Requirements:**
```yaml
WebSocket Events:
  Authentication: JWT token in connection auth
  
  Rooms:
    - user_{userId}: Personal notifications
    - listing_{listingId}: Bidding updates
    - transaction_{transactionId}: Status updates
    
  Event Types:
    bid_placed: { listingId, bidAmount, bidderId, timeRemaining }
    listing_approved: { listingId, approvedAt, adminId }
    agent_assigned: { transactionId, agentId, contactInfo }
```

## 📊 **Database Schema Requirements**

### **Core Tables**

```sql
-- Users table with WhatsApp as primary auth
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number VARCHAR(15) UNIQUE NOT NULL, -- +91XXXXXXXXXX format
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL,
  email VARCHAR(255), -- Optional, can be null
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE, -- For vendors/agents
  profile_image TEXT,
  business_info JSONB, -- For vendors/agents
  bank_details JSONB, -- For clients (encrypted)
  address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Device listings with admin approval flow
CREATE TABLE device_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id),
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  variant VARCHAR(100) NOT NULL,
  condition device_condition NOT NULL,
  description TEXT NOT NULL,
  asking_price INTEGER NOT NULL, -- Price in paise (₹1 = 100 paise)
  photos JSONB NOT NULL, -- Array of photo objects
  imei1 VARCHAR(15) NOT NULL,
  imei2 VARCHAR(15),
  specifications JSONB,
  warranty_info JSONB,
  bill_image TEXT,
  pickup_address JSONB NOT NULL,
  status listing_status DEFAULT 'PENDING',
  admin_approval JSONB, -- approval status, reviewer, comments
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  expires_at TIMESTAMP -- 24 hours after approval
);

-- Bidding system with time constraints
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES device_listings(id),
  vendor_id UUID REFERENCES users(id),
  amount INTEGER NOT NULL, -- Price in paise
  status bid_status DEFAULT 'ACTIVE',
  placed_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL -- 24 hours from listing approval
);

-- Complete transaction lifecycle
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES device_listings(id),
  client_id UUID REFERENCES users(id),
  vendor_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES users(id),
  winning_bid_amount INTEGER NOT NULL,
  final_amount INTEGER, -- After deductions
  deductions JSONB, -- Array of deduction objects
  status transaction_status DEFAULT 'BID_ACCEPTED',
  phase transaction_phase DEFAULT 'VERIFICATION',
  otp_verification JSONB, -- client and vendor OTP status
  agent_verification JSONB, -- verification details
  payment_details JSONB, -- bank transfer info
  timeline JSONB, -- Array of timeline events
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

## 🔐 **Authentication & Security**

### **WhatsApp OTP Flow**
```typescript
// 1. Request OTP
POST /api/auth/whatsapp/request-otp
{
  "phoneNumber": "+919876543210"
}
Response: {
  "otpId": "otp_12345",
  "expiresIn": 300, // 5 minutes
  "deliveryStatus": "sent"
}

// 2. Verify OTP
POST /api/auth/whatsapp/verify-otp
{
  "otpId": "otp_12345",
  "otp": "123456"
}
Response: {
  "user": User,
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "isNewUser": boolean
}
```

### **JWT Token Structure**
```json
{
  "sub": "user_id",
  "role": "CLIENT|VENDOR|AGENT|ADMIN",
  "whatsapp": "+919876543210",
  "iat": 1640995200,
  "exp": 1641081600
}
```

## 📱 **WhatsApp Integration Details**

### **Template Messages (Pre-approval Required)**
```yaml
OTP_VERIFICATION:
  name: "cellflip_otp"
  language: "en"
  components:
    - type: "BODY"
      text: "Your Cellflip verification code is {{1}}. Valid for 5 minutes. Do not share this code."

LISTING_APPROVED:
  name: "cellflip_listing_approved"
  language: "en"
  components:
    - type: "BODY"
      text: "Great news! Your {{1}} {{2}} listing has been approved. Bidding starts now for 24 hours."

BID_RECEIVED:
  name: "cellflip_bid_received"
  language: "en"
  components:
    - type: "BODY"
      text: "New bid received for your {{1}} {{2}}: ₹{{3}}. View details in the Cellflip app."
```

## ⚡ **Performance Requirements**

### **API Response Times**
- Authentication: < 500ms
- Dashboard data: < 1000ms
- File uploads: < 5000ms
- WebSocket events: < 100ms

### **Concurrency Handling**
```typescript
// Bidding system must handle concurrent bids
// Use database transactions with optimistic locking
BEGIN TRANSACTION;
SELECT * FROM device_listings WHERE id = $1 AND status = 'APPROVED' FOR UPDATE;
INSERT INTO bids (listing_id, vendor_id, amount) VALUES ($1, $2, $3);
-- Check if bid exceeds asking price and auto-close if needed
COMMIT;
```

## 🧪 **Testing Integration**

### **Frontend Mock Switching**
```typescript
// In development, easily switch between mock and real APIs
const apiBaseUrl = process.env.NODE_ENV === 'development' 
  ? (process.env.USE_REAL_API === 'true' 
     ? process.env.NEXT_PUBLIC_API_URL 
     : 'mock://api')
  : process.env.NEXT_PUBLIC_API_URL
```

### **API Testing Checklist**
- [ ] All API endpoints return expected TypeScript interfaces
- [ ] Error responses match frontend error handling
- [ ] File uploads work with multipart/form-data
- [ ] WebSocket events trigger correct UI updates
- [ ] WhatsApp OTP delivery and verification
- [ ] Database transactions handle concurrent operations

## 🚀 **Deployment Requirements**

### **Environment Variables**
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/cellflip

# WhatsApp Business API
WHATSAPP_BUSINESS_API_TOKEN=your_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token

# File Storage
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=cellflip-files
AWS_CLOUDFRONT_DOMAIN=cdn.cellflip.com

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Payment Gateway (Future)
PAYMENT_GATEWAY_KEY=your_payment_key
PAYMENT_GATEWAY_SECRET=your_payment_secret
```

### **Infrastructure Requirements**
- PostgreSQL 14+ with JSON support
- Redis for session storage and rate limiting
- S3-compatible storage for files
- WebSocket support (Socket.io compatible)
- SSL certificate for HTTPS/WSS

## 📞 **Support & Handoff**

### **Integration Support Process**
1. **Week 1**: Backend dev reviews documentation and sets up environment
2. **Week 2**: Implement authentication and user management APIs
3. **Week 3**: Device listing and bidding system APIs
4. **Week 4**: WhatsApp integration and real-time features
5. **Week 5**: Testing, debugging, and deployment

### **Communication Protocol**
- Daily standup to discuss integration issues
- Shared documentation for API changes
- Frontend developer available for immediate clarification
- Code review process for API implementations

---

This handoff package ensures the backend developer has everything needed to build a production-ready API that integrates seamlessly with the existing frontend. 