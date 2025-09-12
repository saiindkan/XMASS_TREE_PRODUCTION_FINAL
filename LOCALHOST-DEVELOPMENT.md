# Localhost Development Guide

## QR Payment System on Localhost

When running your Christmas Tree Shop on localhost (http://localhost:3000), the QR payment system has special handling for development.

### 🧪 **Localhost-Specific Features**

#### 1. **Automatic Detection**
- The system automatically detects when running on localhost
- QR codes are marked as "Development QR Code - For testing only"
- Special testing interface is provided

#### 2. **QR Code Generation**
- QR codes are still generated normally
- Contains development-specific data structure
- Includes localhost URLs and testing instructions

#### 3. **Payment Simulation**
- **"Simulate Payment Completion" button** appears for testing
- Allows you to test the complete payment flow without external services
- Simulates the same order creation and notification process

### 🔧 **How to Test QR Payments on Localhost**

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to checkout:**
   - Add items to cart
   - Go to checkout page
   - Fill out customer information (Step 1)
   - Select "QR Code Payment" (Step 2)

3. **Generate QR Code:**
   - Click "Complete Payment"
   - QR code will be generated and displayed
   - You'll see "🧪 Localhost Testing Mode" section

4. **Simulate Payment:**
   - Click "Simulate Payment Completion" button
   - Payment will be processed automatically
   - Order will be created in database
   - Success page will be shown

### 📱 **Why Mobile Payment Apps Can't Access Localhost**

- **Network Isolation**: Mobile devices can't reach `localhost` or `127.0.0.1`
- **Security**: Mobile payment apps require HTTPS and public URLs
- **Development Only**: Localhost is for development, not production payments

### 🌐 **Production vs Development**

| Feature | Localhost | Production |
|---------|-----------|------------|
| QR Code | Development data | Real payment data |
| Payment Apps | Cannot access | Can scan and pay |
| Testing | Simulate button | Real payments |
| URLs | localhost:3000 | yourdomain.com |

### 🔍 **QR Code Data Structure (Localhost)**

```json
{
  "type": "payment",
  "paymentId": "qr_1234567890_abc123",
  "amount": 100,
  "currency": "usd",
  "merchant": "Christmas Tree Shop (Development)",
  "timestamp": 1234567890,
  "environment": "development",
  "testMode": true,
  "localhost": {
    "paymentUrl": "http://localhost:3000/api/qr-payment/pay",
    "statusUrl": "http://localhost:3000/api/qr-payment/status?qrPaymentId=qr_1234567890_abc123",
    "instructions": "For localhost testing, you can simulate payment completion by calling the pay endpoint."
  }
}
```

### 🚀 **Testing the Complete Flow**

1. **Card Payment**: Works normally with Stripe test keys
2. **QR Payment**: Use simulation button for testing
3. **Order Creation**: Both methods create orders in database
4. **Notifications**: Email/SMS notifications work (if configured)
5. **Status Updates**: Payment status tracking works for both methods

### ⚙️ **Environment Variables for Localhost**

Make sure your `.env.local` file includes:

```env
# Development URLs
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe (test keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Email/SMS for notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 🎯 **Key Benefits of Localhost Testing**

- **No External Dependencies**: Test without mobile payment apps
- **Full Flow Testing**: Complete order processing simulation
- **Database Integration**: Real database operations
- **Error Handling**: Test error scenarios safely
- **Development Speed**: Fast iteration without external services

The localhost QR payment system provides a complete development experience while maintaining the same functionality as production!
