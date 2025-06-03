# Cellflip Testing Guide

## 🚀 **Pre-Configured Test Accounts**

Use these accounts to test different user roles and workflows:

### **1. Client Account (Device Seller)**
- **Phone**: `+919876543210` or `9876543210`
- **Name**: Rajesh Kumar
- **Role**: CLIENT
- **OTP**: `123456`
- **Purpose**: Test device listing, bid acceptance, pickup scheduling

### **2. Vendor Account (Device Buyer)**
- **Phone**: `+919876543211` or `9876543211` 
- **Name**: Suresh Menon (Mobile Palace Thrissur)
- **Role**: VENDOR
- **OTP**: `123456`
- **Purpose**: Test marketplace browsing, bid placement, device receipt

### **3. Agent Account (Device Verifier)**
- **Phone**: `+919876543212` or `9876543212`
- **Name**: Priya Nair
- **Role**: AGENT  
- **OTP**: `123456`
- **Purpose**: Test pickup workflows, device verification, delivery

### **4. Admin Account**
- **Phone**: `+919876543213` or `9876543213`
- **Name**: Admin User
- **Role**: ADMIN
- **OTP**: `123456`
- **Purpose**: Test listing approvals, agent assignments

---

## 🔐 **How to Login**

### **Method 1: Standard Login Flow**
1. Go to `/login`
2. Enter any of the phone numbers above
3. Click "Send Verification Code"
4. Enter OTP: `123456`
5. Click "Verify & Sign In"
6. You'll be redirected to the appropriate dashboard

### **Method 2: Browser Console Quick Login**
Open browser console and run:
```javascript
// Quick login as Client
localStorage.setItem('cellflip_user', JSON.stringify({
  id: 'client_001',
  name: 'Rajesh Kumar',
  role: 'CLIENT',
  whatsappNumber: '+919876543210'
}));
window.location.href = '/dashboard';

// Quick login as Vendor
localStorage.setItem('cellflip_user', JSON.stringify({
  id: 'vendor_001', 
  name: 'Suresh Menon',
  role: 'VENDOR',
  whatsappNumber: '+919876543211'
}));
window.location.href = '/vendor/dashboard';

// Quick login as Agent
localStorage.setItem('cellflip_user', JSON.stringify({
  id: 'agent_001',
  name: 'Priya Nair', 
  role: 'AGENT',
  whatsappNumber: '+919876543212'
}));
window.location.href = '/agent/dashboard';

// Quick login as Admin
localStorage.setItem('cellflip_user', JSON.stringify({
  id: 'admin_001',
  name: 'Admin User',
  role: 'ADMIN', 
  whatsappNumber: '+919876543213'
}));
window.location.href = '/admin/dashboard';
```

---

## 📱 **Testing New User Registration**

### **1. Sign Up Flow**
1. Go to `/register`
2. Enter a new phone number (not one of the test accounts)
3. Choose your role: CLIENT, VENDOR, or AGENT
4. Fill in your details
5. Enter OTP: `123456`
6. Complete profile setup

### **2. Test Phone Numbers for New Users**
Use any of these formats for new accounts:
- `9123456789` (will become `+919123456789`)
- `9234567890`
- `9345678901`
- etc.

---

## 🧪 **Complete User Flow Testing**

### **🔵 Client Flow: Selling a Device**

#### **Step 1: List a Device**
1. Login as Client (`+919876543210`)
2. Go to Dashboard → "List Device" or `/listing/create`
3. Fill device details:
   - **Brand**: Apple
   - **Model**: iPhone 14
   - **Storage**: 128GB
   - **Color**: Blue
   - **Condition**: Excellent
   - **Asking Price**: ₹65,000
   - **IMEI**: Any 15-digit number
4. Upload photos (optional for testing)
5. Add pickup address (pre-filled with test data)
6. Submit listing

#### **Step 2: Wait for Admin Approval**
1. Switch to Admin account (`+919876543213`)
2. Go to Admin Dashboard → Pending Approvals
3. Review and approve the listing

#### **Step 3: Monitor Bids**
1. Switch back to Client account
2. Go to Dashboard → "My Listings"
3. View incoming bids from vendors

#### **Step 4: Accept a Bid**
1. Click on a listing with bids
2. Review vendor offers
3. Click "Accept Bid" on preferred offer
4. Confirm acceptance

#### **Step 5: Agent Assignment**
1. Switch to Admin account
2. Go to pending assignments
3. Click "Assign Agent" on the transaction
4. Select available agent (Priya Nair)
5. Set pickup schedule
6. Confirm assignment

#### **Step 6: Track Pickup**
1. Switch back to Client account  
2. Go to Dashboard → "Track Transaction"
3. See agent details and pickup schedule
4. Wait for agent contact

---

### **🟢 Vendor Flow: Buying a Device**

#### **Step 1: Browse Marketplace**
1. Login as Vendor (`+919876543211`)
2. Go to Vendor Dashboard → "Browse Devices" or `/marketplace`
3. Browse available listings
4. Use filters (brand, condition, price range)

#### **Step 2: Place Bids**
1. Click on a device listing
2. Review device details and photos
3. Enter bid amount (below asking price)
4. Add optional message to client
5. Submit bid

#### **Step 3: Monitor Bid Status**
1. Go to Dashboard → "My Bids"
2. Track bid status (Active/Outbid/Winning)
3. Place higher bids if outbid

#### **Step 4: Receive Device**
1. Wait for bid acceptance notification
2. Coordinate with assigned agent
3. Prepare for device delivery
4. Verify device condition upon receipt

---

### **🟡 Agent Flow: Device Verification & Delivery**

#### **Step 1: Accept Assignment**
1. Login as Agent (`+919876543212`)
2. Go to Agent Dashboard
3. See assigned pickup jobs
4. Accept assignment

#### **Step 2: Device Pickup**
1. Navigate to pickup location
2. Go to `/agent/pickup/transaction_123` (replace with actual ID)
3. **Complete 8-step verification process**:

   **Step 1: Customer Identity Verification**
   - Select ID type (Aadhaar/PAN/Driving License)
   - Enter ID number: `123456789012`
   - Upload ID photo
   - Check verification box

   **Step 2: Device Inspection**
   - Check functional issues (display, touch, buttons, etc.)
   - Check physical issues (scratches, dents, etc.)
   - Select included accessories
   - Enter battery health: `85`
   - Add inspection notes

   **Step 3: Verification Photos**
   - Upload 4 device photos (front, back, screen on, damage)
   - Upload bill photo (optional)
   - Upload packaging photo (optional)

   **Step 4: Condition Assessment**
   - Select actual condition
   - See mismatch warnings if condition differs

   **Step 5: Deduction Calculation**
   - Click "Calculate Deductions"
   - Review automatic deductions:
     - Condition mismatch: 10%
     - Functional issues: 5% each
     - Physical issues: 3% each
     - Missing accessories: 5%
     - Low battery: 8%

   **Step 6: Final Offer Generation**
   - Review calculated final offer
   - Send to customer for approval

   **Step 7: Customer OTP Acceptance**
   - Customer receives final offer via WhatsApp
   - Enter OTP: `123456` to confirm acceptance

   **Step 8: Completion**
   - Transaction moves to delivery phase

#### **Step 3: Device Delivery**
1. Go to `/agent/delivery/transaction_123`
2. **Complete 6-step delivery process**:

   **Step 1: Navigate to Vendor**
   - See vendor location and contact details
   - Click "Open in Maps" for navigation
   - Mark "I've Reached the Vendor Location"

   **Step 2: Verify Vendor Identity**
   - Upload vendor ID photo
   - Check verification box

   **Step 3: Device Handover**
   - Upload handover photo
   - Add delivery notes

   **Step 4: Vendor Receipt Confirmation**
   - Vendor receives OTP: `123456`
   - Vendor confirms device receipt

   **Step 5: Client Final Confirmation**
   - Client receives final OTP: `123456`
   - Client confirms transaction completion

   **Step 6: Payment Processing**
   - Automatic payment distribution
   - Agent commission: 5% of final offer

---

### **🔴 Admin Flow: Platform Management**

#### **Step 1: Review Listings**
1. Login as Admin (`+919876543213`)
2. Go to Admin Dashboard → "Pending Approvals"
3. Review device listings
4. Approve/Reject with comments

#### **Step 2: Assign Agents**
1. Go to "Agent Assignments"
2. See approved transactions awaiting agents
3. Click "Assign Agent"
4. **Use Agent Assignment Interface**:
   - Review transaction details
   - Browse available agents
   - Check agent ratings, pickups, availability
   - Set priority (High/Normal/Low)
   - Schedule pickup date/time
   - Add assignment notes
   - Confirm assignment

#### **Step 3: Monitor Transactions**
1. Go to "Transaction Monitor"
2. Track all active transactions
3. See real-time status updates
4. Handle disputes if any

---

## 🧪 **Testing Edge Cases**

### **OTP Testing**
- **Valid OTP**: `123456` (works for all scenarios)
- **Invalid OTP**: Any other 6-digit number
- **Expired OTP**: Wait 10 minutes
- **Max Attempts**: Try wrong OTP 3 times

### **Device Condition Testing**
- **Perfect Match**: Set actual condition = listed condition (no deductions)
- **Condition Mismatch**: Set actual condition worse than listed (10% deduction)
- **Multiple Issues**: Check multiple functional/physical issues
- **Low Battery**: Set battery health below 80% (8% deduction)
- **Missing Accessories**: Uncheck accessories (5% deduction)

### **File Upload Testing**
- **Valid Images**: Upload JPG/PNG images under 5MB
- **Invalid Files**: Try PDF, TXT, or large files
- **Mobile Camera**: Test camera capture on mobile devices
- **Multiple Photos**: Upload 4+ device photos

### **Error Scenarios**
- **Network Errors**: Disable internet during API calls
- **Invalid Data**: Submit forms with missing required fields
- **Unauthorized Access**: Try accessing wrong role dashboards
- **Session Expiry**: Clear localStorage and try protected routes

---

## 📱 **Mobile Testing**

### **Responsive Design**
- Test on different screen sizes (mobile, tablet, desktop)
- Check touch interactions and mobile navigation
- Verify camera capture functionality
- Test form usability on mobile

### **Mobile-Specific Features**
- Camera photo capture
- WhatsApp deep linking
- Touch-friendly buttons and inputs
- Mobile-optimized layouts

---

## 🔧 **Developer Testing Tools**

### **Browser Console Commands**
```javascript
// Check current user
console.log('Current User:', JSON.parse(localStorage.getItem('cellflip_user') || '{}'));

// Clear session
localStorage.removeItem('cellflip_user');
localStorage.removeItem('cellflip_auth_token');

// Switch roles quickly (copy-paste any of the quick login commands above)
```

### **Testing URLs**
- **Login**: `/login`
- **Register**: `/register`
- **Client Dashboard**: `/dashboard`
- **Vendor Dashboard**: `/vendor/dashboard`
- **Agent Dashboard**: `/agent/dashboard`
- **Admin Dashboard**: `/admin/dashboard`
- **Marketplace**: `/marketplace`
- **Create Listing**: `/listing/create`
- **Agent Pickup**: `/agent/pickup/transaction_123`
- **Agent Delivery**: `/agent/delivery/transaction_123`

### **Mock Data Customization**
Edit `src/lib/test-auth.ts` to:
- Add more test accounts
- Modify user details
- Change mock transaction data
- Update Kerala locations

---

## ✅ **Testing Checklist**

### **Authentication**
- [ ] Login with all 4 test accounts
- [ ] OTP verification works
- [ ] Role-based dashboard routing
- [ ] Session persistence
- [ ] Logout functionality

### **Client Flows**
- [ ] Device listing creation
- [ ] Photo uploads
- [ ] Bid monitoring
- [ ] Bid acceptance
- [ ] Transaction tracking

### **Vendor Flows**
- [ ] Marketplace browsing
- [ ] Device filtering
- [ ] Bid placement
- [ ] Bid management
- [ ] Device receipt

### **Agent Flows**
- [ ] Pickup assignment acceptance
- [ ] 8-step verification process
- [ ] Deduction calculations
- [ ] Customer OTP verification
- [ ] 6-step delivery process
- [ ] Dual OTP confirmations

### **Admin Flows**
- [ ] Listing approvals
- [ ] Agent assignment interface
- [ ] Transaction monitoring
- [ ] Platform management

### **Cross-Platform**
- [ ] Desktop Chrome/Firefox/Safari
- [ ] Mobile Chrome/Safari
- [ ] Tablet view
- [ ] Touch interactions

---

## 🐛 **Common Issues & Solutions**

### **Login Issues**
- **Problem**: OTP not working
- **Solution**: Always use OTP `123456` for test accounts

### **Role Access Issues**
- **Problem**: Wrong dashboard after login
- **Solution**: Clear localStorage and login again

### **File Upload Issues**
- **Problem**: Photos not uploading
- **Solution**: Use small image files (< 5MB), JPG/PNG format

### **Navigation Issues**
- **Problem**: Can't access certain pages
- **Solution**: Make sure you're logged in with correct role

This testing guide covers all implemented workflows and provides multiple ways to test the complete Cellflip platform. Use the pre-configured accounts for quick testing, or create new accounts to test the registration flow. 