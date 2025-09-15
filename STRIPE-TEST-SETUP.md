# 🧪 Stripe QR Payment Test Setup

## 🚀 Quick Start (Test Mode)

### 1. Get Stripe Test Keys
1. Go to [stripe.com](https://stripe.com) and create account
2. Go to Dashboard → Developers → API keys
3. Copy your **Test** keys (not Live keys)

### 2. Update Your .env.local File
```bash
# Stripe Test Configuration
STRIPE_SECRET_KEY=sk_test_51ABC123...your_test_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...your_test_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...your_webhook_secret
STRIPE_QR_WEBHOOK_SECRET=whsec_1234567890abcdef...your_qr_webhook_secret

# Base URL for development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Set Up Test Webhook (Optional for Development)
For localhost testing, you can use Stripe CLI:
```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhook/stripe-qr
```

## 🧪 Test Cards

Use these Stripe test cards for testing:

| Card Number | Description | Expected Result |
|-------------|-------------|-----------------|
| `4242424242424242` | Visa | ✅ Success |
| `4000000000000002` | Visa | ❌ Declined |
| `4000002500003155` | Visa | 🔐 Requires Authentication |
| `5555555555554444` | Mastercard | ✅ Success |
| `378282246310005` | American Express | ✅ Success |

## 📱 Mobile Payment Testing

### Apple Pay (iOS)
1. Use iPhone/iPad with test Apple ID
2. Add test card to Apple Wallet
3. Scan QR code with Camera app
4. Select Apple Pay when prompted

### Google Pay (Android)
1. Use Android device with test Google account
2. Add test card to Google Pay
3. Scan QR code with Google Pay app
4. Complete payment

## 🔍 Testing Steps

### 1. Test QR Code Generation
1. Go to checkout page
2. Select "QR Code Payment"
3. Click "Complete Payment"
4. Verify QR code appears

### 2. Test Payment Simulation
1. In development mode, click "Simulate Real Payment"
2. Verify payment status changes to "completed"
3. Check order confirmation page appears

### 3. Test Real Mobile Payment
1. Use mobile device with payment app
2. Scan QR code
3. Complete payment
4. Verify real-time status updates

## 🚨 Troubleshooting

### Common Issues
1. **QR Code Not Generating**: Check Stripe keys in .env.local
2. **Payment Failing**: Verify test card numbers
3. **Webhook Not Working**: Check webhook URL and secret
4. **Status Not Updating**: Check network connection

### Debug Tools
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Monitor API calls
- **Stripe Dashboard**: View payment intents and webhooks

## 🎯 Production Setup

When ready for production:

1. **Switch to Live Keys**: Replace test keys with live keys
2. **Update Webhook URL**: Change to production domain
3. **Enable SSL**: Required for Apple Pay/Google Pay
4. **Test with Real Cards**: Use small amounts for testing

## 📞 Support

- **Stripe Support**: [support.stripe.com](https://support.stripe.com)
- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Test Cards**: [stripe.com/docs/testing](https://stripe.com/docs/testing)
