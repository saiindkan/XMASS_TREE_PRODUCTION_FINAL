// Code modified by Tharun
/** @type {import('next').NextConfig} */
// Determine if we're in development or production
const isDev = process.env.NODE_ENV !== 'production';
const repo = 'your-repo-name'; // Replace with your repository name

const nextConfig = {
  // Disable static export for NextAuth compatibility
  // output: 'export', // Commented out - incompatible with NextAuth and API routes
  // Set the base path to your repository name if using GitHub Pages (only for static sites)
  // basePath: isDev ? '' : `/${repo}`,
  // Set the asset prefix for static assets (only for static sites)
  // assetPrefix: isDev ? '' : `/${repo}/`,
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'nyykggssyasvxrtjhhhb.supabase.co',
      },
    ],
  },
  webpack: (config) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/lib': `${__dirname}/src/lib`,
      '@/auth': `${__dirname}/src/auth.ts`,
    };
    return config;
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // ✅ Unified Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://*.stripe.com https://b.stripecdn.com;
              script-src-elem 'self' 'unsafe-inline' https://js.stripe.com https://*.stripe.com https://b.stripecdn.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://b.stripecdn.com;
              img-src 'self' data: https://*.stripe.com https://*.googleusercontent.com https://q.stripe.com https://images.unsplash.com https://nyykggssyasvxrtjhhhb.supabase.co;
              font-src 'self' data: https://fonts.gstatic.com https://b.stripecdn.com;
              connect-src 'self' https://api.stripe.com https://*.stripe.com https://b.stripecdn.com;
              frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://b.stripecdn.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self' https://b.stripecdn.com;
              frame-ancestors 'self';
            `.replace(/\s+/g, ' ').trim(),
          },
          // Other security headers
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
      {
        // Extra security for checkout and payment pages
        source: '/(checkout|order-confirmation)/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ],
      }
    ]
  },
  // Redirect HTTP to HTTPS in production
  async redirects() {
    return process.env.NODE_ENV === 'production' ? [
      {
        source: '/(.*)',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://your-domain.com/:path*',
        permanent: true,
      },
    ] : []
  },
}

module.exports = nextConfig
