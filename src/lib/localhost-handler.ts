// Localhost development handler for QR payments
// This handles the differences between localhost and production environments

export interface LocalhostConfig {
  isLocalhost: boolean
  baseUrl: string
  qrPaymentUrl: string
  webhookUrl: string
}

export function getLocalhostConfig(): LocalhostConfig {
  // More robust environment detection
  const isLocalhost = process.env.NODE_ENV === 'development' || 
                     process.env.NEXTAUTH_URL?.includes('localhost') ||
                     process.env.NEXTAUTH_URL?.includes('127.0.0.1') ||
                     (process.env.VERCEL_URL && (
                       process.env.VERCEL_URL.includes('localhost') ||
                       process.env.VERCEL_URL.includes('127.0.0.1')
                     ))
  
  // Determine base URL with fallbacks for production
  let baseUrl: string
  
  if (process.env.NEXTAUTH_URL) {
    baseUrl = process.env.NEXTAUTH_URL
  } else if (process.env.VERCEL_URL) {
    // Vercel provides VERCEL_URL in production
    baseUrl = `https://${process.env.VERCEL_URL}`
  } else if (process.env.NEXT_PUBLIC_BASE_URL) {
    // Custom production URL
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  } else if (isLocalhost) {
    // Default localhost
    baseUrl = 'http://localhost:3000'
  } else {
    // Fallback for production (should be overridden by environment variables)
    baseUrl = 'https://your-domain.com'
  }
  
  // Ensure URL doesn't end with slash
  baseUrl = baseUrl.replace(/\/$/, '')
  
  // For localhost, we'll use a different approach for QR payments
  const qrPaymentUrl = isLocalhost 
    ? `${baseUrl}/api/qr-payment/pay` // Local API endpoint
    : `${baseUrl}/api/qr-payment/pay` // Production API endpoint
  
  const webhookUrl = isLocalhost
    ? `${baseUrl}/api/webhook` // Local webhook
    : `${baseUrl}/api/webhook` // Production webhook
  
  return {
    isLocalhost,
    baseUrl,
    qrPaymentUrl,
    webhookUrl
  }
}

// Generate QR code data that works for both production and localhost
export function generateQRCodeData(paymentId: string, amount: number, currency: string, config: LocalhostConfig) {
  // For mobile camera scanning, we need a simple URL that opens a payment page
  const paymentUrl = `${config.baseUrl}/qr-pay/${paymentId}`
  
  // Return a simple URL that works with phone cameras
  return paymentUrl
}

// Handle localhost-specific payment completion
export function handleLocalhostPayment(paymentId: string, config: LocalhostConfig) {
  if (config.isLocalhost) {
    // For localhost, we can simulate payment completion
    // In a real scenario, this would be called by an external service
    return {
      simulated: true,
      message: 'Localhost payment simulation',
      paymentId: paymentId,
      status: 'completed',
      timestamp: Date.now()
    }
  }
  return null
}

// Get environment-specific instructions for QR payment
export function getQRPaymentInstructions(config: LocalhostConfig): string {
  if (config.isLocalhost) {
    return `
      Development Mode QR Code:
      
      1. This QR code contains payment data for testing
      2. Amount: $${(config as any).amount || '0.00'}
      3. For testing, you can manually complete the payment
      4. Check the browser console for payment status updates
      
      Note: Mobile payment apps cannot access localhost URLs.
      This QR code is for development testing only.
    `
  } else {
    return 'Scan this QR code with your mobile payment app to complete the payment.'
  }
}
