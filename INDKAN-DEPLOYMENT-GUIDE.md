# 🎄 Indkan Christmas Trees - Production Deployment Guide

## ✅ **Configured for Your Domain**

Your QR payment system is now specifically configured for **https://www.indkanchristmastree.com/**

### 🔧 **Environment Variables for Production**

#### **Required for Indkan Christmas Trees**

```bash
# Base URL Configuration (CRITICAL for QR payments)
NEXTAUTH_URL=https://www.indkanchristmastree.com

# Stripe Configuration (Use LIVE keys for production)
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_QR_WEBHOOK_SECRET=whsec_your_qr_webhook_secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 📱 **QR Code URLs for Your Domain**

When customers scan QR codes on your production site, they will open:

```
https://www.indkanchristmastree.com/qr-pay/{paymentId}
```

### 🚀 **Deployment Options**

#### **Option 1: Vercel (Recommended)**

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   ```bash
   NEXTAUTH_URL=https://www.indkanchristmastree.com
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   # ... other variables
   ```
3. **Configure custom domain** in Vercel:
   - Add `www.indkanchristmastree.com` as custom domain
   - Vercel will automatically handle SSL certificates
4. **Deploy** - Your site will be live at https://www.indkanchristmastree.com

#### **Option 2: Netlify**

1. **Set environment variables** in Netlify dashboard:
   ```bash
   NEXTAUTH_URL=https://www.indkanchristmastree.com
   NEXT_PUBLIC_BASE_URL=https://www.indkanchristmastree.com
   # ... other variables
   ```
2. **Configure custom domain** in Netlify
3. **Deploy** your site

#### **Option 3: Custom Server**

1. **Set environment variables** on your server:
   ```bash
   NEXTAUTH_URL=https://www.indkanchristmastree.com
   NEXT_PUBLIC_BASE_URL=https://www.indkanchristmastree.com
   # ... other variables
   ```
2. **Build and deploy**:
   ```bash
   npm run build
   npm start
   ```

### 🧪 **Testing Your Production Site**

#### **1. Test QR Code Generation**
```bash
# Create a QR payment on your production site
curl -X POST https://www.indkanchristmastree.com/api/stripe-qr-payment/create \
  -H "Content-Type: application/json" \
  -d '{"amount": 1.00, "currency": "usd", "customerInfo": {...}}'
```

#### **2. Test QR Payment Page**
```bash
# Test the payment page
curl https://www.indkanchristmastree.com/qr-pay/stripe_qr_1234567890_abcdef
```

#### **3. Test Mobile Scanning**
1. **Visit** https://www.indkanchristmastree.com/checkout
2. **Add items** to cart
3. **Generate QR code** for payment
4. **Scan with phone camera**
5. **Verify payment page opens** at https://www.indkanchristmastree.com/qr-pay/{paymentId}

### 🔒 **Stripe Webhook Configuration**

Configure these webhook endpoints in your Stripe dashboard:

```
https://www.indkanchristmastree.com/api/webhook
https://www.indkanchristmastree.com/api/webhook/stripe-qr
```

### 📊 **Production Checklist for Indkan Christmas Trees**

#### **Before Deployment**
- [ ] **Environment variables** set with your domain
- [ ] **Stripe keys** updated to live keys
- [ ] **Webhook endpoints** configured in Stripe
- [ ] **Domain** properly configured
- [ ] **SSL certificate** installed

#### **After Deployment**
- [ ] **Site loads** at https://www.indkanchristmastree.com
- [ ] **QR codes generate** correctly
- [ ] **Payment pages load** on mobile
- [ ] **Payments process** successfully
- [ ] **Orders create** with items
- [ ] **Email notifications** send
- [ ] **Webhooks receive** Stripe events

### 🎯 **Customer Experience Flow**

1. **Customer visits** https://www.indkanchristmastree.com
2. **Browses Christmas trees** and adds to cart
3. **Goes to checkout** at https://www.indkanchristmastree.com/checkout
4. **Selects QR payment** option
5. **Scans QR code** with phone camera
6. **Payment page opens** at https://www.indkanchristmastree.com/qr-pay/{paymentId}
7. **Completes payment** (Apple Pay, Google Pay, or Card)
8. **Order created** automatically
9. **Email confirmation** sent

### 🎉 **Production Benefits**

#### ✅ **Brand Consistency**
- **QR codes** contain your domain URL
- **Payment pages** branded with Indkan Christmas Trees
- **Professional appearance** for customers

#### ✅ **Mobile Optimization**
- **Phone cameras** work perfectly with your domain
- **Responsive payment pages**
- **Fast loading times**

#### ✅ **Real-Time Processing**
- **Live payment status** updates
- **Automatic order creation**
- **Instant email notifications**

#### ✅ **Scalable Architecture**
- **Production-ready** configuration
- **Secure environment** variable handling
- **Comprehensive error** handling

## 🚀 **Quick Deployment Steps**

### **For Vercel (Recommended)**

1. **Set environment variables**:
   ```bash
   NEXTAUTH_URL=https://www.indkanchristmastree.com
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Configure custom domain** in Vercel dashboard

4. **Test QR payments**:
   - Visit https://www.indkanchristmastree.com/checkout
   - Generate QR code and scan with phone

## 🎯 **Summary**

Your **Indkan Christmas Trees** QR payment system is configured for:

- ✅ **Production domain**: https://www.indkanchristmastree.com
- ✅ **QR codes**: https://www.indkanchristmastree.com/qr-pay/{paymentId}
- ✅ **Mobile camera scanning**: Works perfectly
- ✅ **Real-time payments**: Stripe integration
- ✅ **Order management**: Automatic creation
- ✅ **Email notifications**: Customer confirmations

**Your Christmas tree business is ready for production!** 🎄💰

---

## 📝 **Files Updated for Indkan Christmas Trees**

- ✅ `env.local.example` - Updated with your domain
- ✅ `PRODUCTION-DEPLOYMENT-GUIDE.md` - Updated with your domain
- ✅ `test-production-config.js` - Updated with your domain
- ✅ `INDKAN-DEPLOYMENT-GUIDE.md` - Created specifically for your domain

**Deploy with confidence to https://www.indkanchristmastree.com!** 🚀
