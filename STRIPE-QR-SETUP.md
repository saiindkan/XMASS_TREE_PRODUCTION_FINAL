# 🚀 Stripe QR Payment Setup Guide

## 📋 Required Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Base URL (for webhooks and callbacks)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # For development
# NEXT_PUBLIC_BASE_URL=https://yourdomain.com  # For production
```

## 🔧 Stripe Dashboard Setup

### 1. Create Stripe Account
- Go to [stripe.com](https://stripe.com)
- Create account or sign in
- Get your API keys from Dashboard → Developers → API keys

### 2. Configure Webhooks
- Go to Dashboard → Developers → Webhooks
- Click "Add endpoint"
- URL: `https://yourdomain.com/api/webhook/stripe-qr`
- Events to send:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `payment_intent.canceled`
- Copy the webhook secret

### 3. Enable Payment Methods
- Go to Dashboard → Settings → Payment methods
- Enable:
  - ✅ Apple Pay
  - ✅ Google Pay
  - ✅ Link
  - ✅ Cards

## 📱 Mobile Payment Integration

### Apple Pay Setup
1. **Domain Verification**: Add your domain to Apple Developer Console
2. **Merchant ID**: Create merchant ID in Apple Developer Console
3. **Stripe Integration**: Stripe handles Apple Pay automatically

### Google Pay Setup
1. **Google Pay API**: Enable in Google Cloud Console
2. **Merchant ID**: Configure in Google Pay Console
3. **Stripe Integration**: Stripe handles Google Pay automatically

## 🧪 Testing

### Test Cards
Use these Stripe test cards:
- **Success**: `4242424242424242`
- **Declined**: `4000000000000002`
- **Requires Authentication**: `4000002500003155`

### Test Mobile Payments
1. **Apple Pay**: Use iPhone/iPad with test Apple ID
2. **Google Pay**: Use Android device with test Google account
3. **QR Code**: Scan with mobile banking apps

## 🚀 Production Deployment

### 1. Update Environment Variables
```bash
# Production Stripe keys
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 2. Update Webhook URL
- Change webhook URL to production domain
- Test webhook delivery

### 3. SSL Certificate
- Ensure HTTPS is enabled
- Required for Apple Pay and Google Pay

## 🔍 Real-Time Features

### ✅ What's Implemented
- **Stripe QR Codes**: Real payment processing
- **Mobile Payment Apps**: Apple Pay, Google Pay support
- **Real-Time Webhooks**: Instant payment confirmations
- **Status Polling**: Backup status checking
- **Order Creation**: Automatic order processing
- **Email Notifications**: Payment confirmations

### 🎯 How It Works
1. **QR Code Generation**: Creates Stripe Payment Intent
2. **Mobile Scan**: User scans with payment app
3. **Payment Processing**: Stripe handles payment
4. **Webhook Notification**: Real-time payment confirmation
5. **Order Creation**: Automatic order processing
6. **Email Notification**: Customer confirmation

## 🛠️ Troubleshooting

### Common Issues
1. **Webhook Not Working**: Check URL and secret
2. **Mobile Payments Failing**: Verify domain and SSL
3. **QR Code Not Scanning**: Check QR data format
4. **Payment Status Not Updating**: Check webhook delivery

### Debug Tools
- **Stripe Dashboard**: View payments and webhooks
- **Browser Console**: Check for errors
- **Network Tab**: Monitor API calls
- **Webhook Logs**: Check delivery status

## 📞 Support

- **Stripe Support**: [support.stripe.com](https://support.stripe.com)
- **Apple Pay Support**: [developer.apple.com](https://developer.apple.com)
- **Google Pay Support**: [developers.google.com](https://developers.google.com)
