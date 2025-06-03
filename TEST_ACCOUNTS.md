# 🧪 **Cellflip Test Accounts - Quick Reference**

## **📋 Account Summary**

| Role | Phone | Name | OTP | Dashboard |
|------|-------|------|-----|-----------|
| **CLIENT** | `9876543210` | Rajesh Kumar | `123456` | `/dashboard` |
| **VENDOR** | `9876543211` | Suresh Menon | `123456` | `/vendor/dashboard` |
| **AGENT** | `9876543212` | Priya Nair | `123456` | `/agent/dashboard` |
| **ADMIN** | `9876543213` | Admin User | `123456` | `/admin/dashboard` |

## **⚡ Quick Login Commands**

Copy-paste in browser console for instant login:

```javascript
// CLIENT LOGIN
localStorage.setItem('cellflip_user', JSON.stringify({id:'client_001',name:'Rajesh Kumar',role:'CLIENT',whatsappNumber:'+919876543210'})); window.location.href='/dashboard';

// VENDOR LOGIN  
localStorage.setItem('cellflip_user', JSON.stringify({id:'vendor_001',name:'Suresh Menon',role:'VENDOR',whatsappNumber:'+919876543211'})); window.location.href='/vendor/dashboard';

// AGENT LOGIN
localStorage.setItem('cellflip_user', JSON.stringify({id:'agent_001',name:'Priya Nair',role:'AGENT',whatsappNumber:'+919876543212'})); window.location.href='/agent/dashboard';

// ADMIN LOGIN
localStorage.setItem('cellflip_user', JSON.stringify({id:'admin_001',name:'Admin User',role:'ADMIN',whatsappNumber:'+919876543213'})); window.location.href='/admin/dashboard';

// LOGOUT
localStorage.clear(); window.location.href='/login';
```

## **🔗 Key Testing URLs**

- **Login**: `/login`
- **Agent Pickup**: `/agent/pickup/txn_001` 
- **Agent Delivery**: `/agent/delivery/txn_001`
- **Device Listing**: `/client/list-device`
- **Marketplace**: `/marketplace`

## **📱 Test Phone Numbers**

For new account testing, use any of these:
- `9123456789`
- `9234567890` 
- `9345678901`
- `9456789012`

**Note**: All test accounts use OTP `123456` 