# 🚀 Quick Setup Guide - Real-Time QR Payments

## ✅ **System Status: READY TO CONFIGURE**

Your real-time QR payment system is **fully implemented** and ready to use! You just need to add your Stripe keys.

## 🔧 **Step 1: Get Stripe Keys (5 minutes)**

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" or "Sign up"
3. Complete account setup

### 2. Get Your Test Keys
1. Go to Dashboard → Developers → API keys
2. Copy your **Test** keys:
   - **Secret key**: `sk_test_...`
   - **Publishable key**: `pk_test_...`

## 🔧 **Step 2: Update Environment Variables (2 minutes)**

### 1. Copy Your Keys to .env.local
```bash
# Add these to your .env.local file
STRIPE_SECRET_KEY=sk_test_51ABC123...your_actual_test_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...your_actual_test_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...your_webhook_secret
STRIPE_QR_WEBHOOK_SECRET=whsec_1234567890abcdef...your_qr_webhook_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🧪 **Step 3: Test the System (2 minutes)**

### 1. Test QR Payment Creation
```bash
# Run the test script
node test-qr-payment.js
```

### 2. Test in Browser
1. Go to `http://localhost:3000`
2. Add a product to cart
3. Go to checkout
4. Select "QR Code Payment"
5. Click "Complete Payment"
6. Click "Simulate Real Payment"

## 🎯 **What You'll See**

### ✅ **Working Features**
- **QR Code Generation**: Real Stripe payment intents
- **Mobile Payment Support**: Apple Pay, Google Pay, banking apps
- **Real-Time Processing**: Instant payment confirmations
- **Order Creation**: Automatic order processing
- **Email Notifications**: Payment confirmations
- **Status Updates**: Real-time payment status

### 📱 **Mobile Payment Flow**
1. **Customer scans QR code** with mobile payment app
2. **Payment is processed** via Stripe in real-time
3. **Order is created** automatically
4. **Confirmation email** is sent
5. **Success page** is displayed

## 🚀 **Production Setup (When Ready)**

### 1. Switch to Live Keys
```bash
# Replace test keys with live keys
STRIPE_SECRET_KEY=sk_live_51ABC123...your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51ABC123...your_live_publishable_key
```

### 2. Set Up Webhooks
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook/stripe-qr`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`
4. Copy webhook secret

### 3. Enable Payment Methods
1. Go to Dashboard → Settings → Payment methods
2. Enable: Apple Pay, Google Pay, Cards, Link

## 🧪 **Test Cards for Development**

| Card Number | Description | Result |
|-------------|-------------|---------|
| `4242424242424242` | Visa | ✅ Success |
| `4000000000000002` | Visa | ❌ Declined |
| `4000002500003155` | Visa | 🔐 Requires Auth |
| `5555555555554444` | Mastercard | ✅ Success |

## 🔍 **Troubleshooting**

### Common Issues
1. **"Failed to create Stripe QR payment"**: Check Stripe keys in .env.local
2. **QR code not generating**: Verify development server is running
3. **Payment simulation failing**: Check database connection
4. **Mobile payments not working**: Verify SSL certificate in production

### Debug Steps
1. **Check .env.local**: Make sure Stripe keys are correct
2. **Restart server**: `npm run dev`
3. **Check browser console**: Look for JavaScript errors
4. **Check network tab**: Monitor API calls

## 📞 **Need Help?**

### Stripe Resources
- **Stripe Dashboard**: [dashboard.stripe.com](https://dashboard.stripe.com)
- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Test Cards**: [stripe.com/docs/testing](https://stripe.com/docs/testing)

### Quick Support
- **Test Script**: `node test-qr-payment.js`
- **Browser Test**: Go to checkout page
- **Mobile Test**: Scan QR code with payment app

---

## 🎉 **You're Almost Ready!**

Your real-time QR payment system is **fully implemented**. Just add your Stripe keys and you'll have:

- ✅ **Real-time mobile payments**
- ✅ **Apple Pay & Google Pay support**
- ✅ **Automatic order creation**
- ✅ **Email notifications**
- ✅ **Production-ready system**

**Next step**: Add your Stripe keys to `.env.local` and restart the server!
