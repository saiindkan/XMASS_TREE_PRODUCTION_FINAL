interface EmailTemplateOptions {
  title: string;
  content: string;
  companyLogoUrl?: string;
  footerText?: string;
}

export function generateEmailTemplate({
  title,
  content,
  companyLogoUrl = process.env.NEXT_PUBLIC_COMPANY_LOGO_URL,
  footerText = '© 2023 Indkan Christmas Tree Store. All rights reserved.'
}: EmailTemplateOptions): string {
  // Ensure we have a proper URL for the logo
  const logoUrl = companyLogoUrl 
    ? companyLogoUrl.startsWith('http') 
      ? companyLogoUrl 
      : `${process.env.NEXTAUTH_URL}${companyLogoUrl}`
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; margin-bottom: 20px; }
        .logo { max-width: 200px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto; }
        .content { padding: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center; }
        .button { 
          display: inline-block; 
          padding: 10px 20px; 
          background-color: #10B981; 
          color: white; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        ${logoUrl ? `<img src="${logoUrl}" alt="Company Logo" class="logo" style="max-width: 200px; height: auto;">` : ''}
        <h1>${title}</h1>
      </div>
      
      <div class="content">
        ${content}
      </div>
      
      <div class="footer">
        <p>${footerText}</p>
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;
}

export const emailTemplates = {
  welcome(name: string, loginUrl: string, companyLogoUrl?: string) {
    const title = 'Welcome to Indkan Christmas Tree Store!';
    const content = `
      <p>Hello ${name},</p>
      <p>Thank you for creating an account with Indkan Christmas Tree Store. We're excited to have you here!</p>
      <p>You can now log in to your account from our website:</p>
      <p><a href="https://indkanchristmastree.com/">Log In to Your Account</a></p>
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The Indkan Team</p>
    `;
    
    return {
      subject: 'Welcome to Indkan Christmas Tree Store!',
      text: `Welcome to Indkan Christmas Tree Store!\n\nHello ${name},\n\nThank you for creating an account with Indkan Christmas Tree Store. You can log in using this link: ${loginUrl}`,
      html: generateEmailTemplate({ 
        title, 
        content, 
        companyLogoUrl: companyLogoUrl
      })
    };
  },

  passwordReset(name: string, resetUrl: string, companyLogoUrl?: string) {
    const title = 'Reset Your Password';
    const otp = resetUrl.split('otp=')[1]?.split('&')[0] || '';
    const isOtpEmail = otp.length === 6;
  
    let content = `
      <p>Hello ${name},</p>
      <p>We received a request to reset your password.</p>
    `;
  
    if (isOtpEmail) {
      content += `
        <div style="margin: 24px 0; text-align: center;">
          <p style="margin-bottom: 16px; font-size: 16px; color: #333;">Your verification code is:</p>
          <div style="
            display: inline-block;
            background-color: #f0fdf4;
            border: 2px solid #86efac;
            border-radius: 8px;
            padding: 12px 24px;
            margin: 8px 0 24px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 4px;
            color: #065f46;
            font-family: monospace;
          ">
            ${otp.match(/\d/g)?.join(' ')}
          </div>
          <p style="margin: 8px 0 16px; font-size: 14px; color: #666;">This code will expire in 15 minutes</p>
        </div>
        <p>Go to your app and enter the verification code above to continue with the password reset process.</p>
      `;
    } else {
      content += `
        <p>Click the button below to set a new password:</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="
            display: inline-block;
            background-color: #10b981;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 500;
          ">Reset Password</a>
        </p>
      `;
    }
  
    content += `
      <p style="margin-top: 24px; color: #666; font-size: 14px;">
        If you didn't request this, you can safely ignore this email.
      </p>
      <p style="margin: 8px 0 0; color: #666; font-size: 14px;">
        Best regards,<br>
        <span style="color: #10b981; font-weight: 500;">The Indkan Team</span>
      </p>
    `;
  
    return {
      subject: isOtpEmail ? 'Your Password Reset Code' : 'Reset Your Password',
      text: isOtpEmail 
        ? `Password Reset Code\n\nHello ${name},\n\nYour verification code is: ${otp}\n\nThis code will expire in 15 minutes.\n\nBest regards,\nThe Indkan Team`
        : `Reset Your Password\n\nHello ${name},\n\nWe received a request to reset your password. Use this link to reset it: ${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
      html: generateEmailTemplate({ 
        title: isOtpEmail ? 'Your Verification Code' : title, 
        content, 
        companyLogoUrl: companyLogoUrl
      })
    };
  },

  passwordResetConfirmation(name: string, companyLogoUrl?: string) {
    const title = 'Password Successfully Reset';
    const content = `
      <p>Hello ${name || 'there'},</p>
      <p>Your password has been successfully updated.</p>
      <p>If you did not make this change, please contact our support team immediately.</p>
      <p>For security reasons, if you didn't request this change, we recommend changing your password through the 'Forgot Password' option on our login page.</p>
      <p>Best regards,<br>The Indkan Team</p>
    `;
    
    return {
      subject: 'Your Password Has Been Reset',
      text: `Password Successfully Reset\n\nHello ${name || 'there'},\n\nYour password has been successfully updated. If you did not make this change, please contact our support team immediately.`,
      html: generateEmailTemplate({ 
        title, 
        content, 
        companyLogoUrl: companyLogoUrl
      })
    };
  },

  loginNotification(name: string, loginTime: string, companyLogoUrl?: string) {
    const title = 'New Login Detected';
    const content = `
      <p>Hello ${name},</p>
      <p>We noticed a new login to your account:</p>
      <p><strong>Time:</strong> ${loginTime}</p>
      <p>If this was you, you can ignore this message. If you don't recognize this activity, please secure your account immediately.</p>
      <p>Best regards,<br>The Indkan Team</p>
    `;
    
    return {
      subject: 'New Login to Your Account',
      text: `New Login Detected\n\nHello ${name},\n\nWe noticed a new login to your account at ${loginTime}. If this wasn't you, please secure your account.`,
      html: generateEmailTemplate({ 
        title, 
        content, 
        companyLogoUrl: companyLogoUrl
      })
    };
  },
};

export function generateOrderConfirmationEmail(orderData: any) {
  // Ensure items is an array and handle undefined values
  const items = Array.isArray(orderData.items) ? orderData.items : []
  
  const itemsList = items.map((item: any) => {
    const productName = item.product_name || item.name || item.product?.name || 'Product Name Not Available'
    const quantity = item.quantity || 1
    const total = item.total || (item.price * quantity) || 0
    
    return `<tr>
      <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${productName}</td>
      <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px;">${quantity}</td>
      <td style="padding: 16px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; font-weight: 600;">$${total.toFixed(2)}</td>
    </tr>`
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Luxury Christmas Trees & Decor</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      </style>
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f8fafc;">
      
      <!-- Main Container -->
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <!-- Header with Christmas Theme -->
        <div style="background: linear-gradient(135deg, #059669, #047857); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
          <!-- Snowflakes decoration -->
          <div style="position: absolute; top: 10px; left: 20px; color: rgba(255,255,255,0.3); font-size: 20px;">❄</div>
          <div style="position: absolute; top: 15px; right: 25px; color: rgba(255,255,255,0.3); font-size: 16px;">❄</div>
          <div style="position: absolute; bottom: 15px; left: 30px; color: rgba(255,255,255,0.3); font-size: 18px;">❄</div>
          <div style="position: absolute; bottom: 10px; right: 20px; color: rgba(255,255,255,0.3); font-size: 14px;">❄</div>
          
          <!-- Company Logo -->
          <div style="margin-bottom: 20px;">
            <img src="${process.env.NEXT_PUBLIC_COMPANY_LOGO_URL || '/BRAND LOGO.png'}" alt="Indkan Xmas Trees Logo" style="max-width: 120px; height: auto; border-radius: 8px; background: rgba(255,255,255,0.1); padding: 8px;">
          </div>
          
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🎄 Indkan Xmas Trees</h1>
          <p style="color: white; margin: 8px 0 0 0; font-size: 18px; font-weight: 500; opacity: 0.9;">Premium Christmas Trees & Holiday Decor</p>
          <div style="background: rgba(255,255,255,0.2); display: inline-block; padding: 8px 20px; border-radius: 20px; margin-top: 15px;">
            <span style="color: white; font-size: 14px; font-weight: 600;">Order Confirmation</span>
          </div>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          
          <!-- Success Message -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: #dcfce7; border: 2px solid #16a34a; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; position: relative;">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 32px; line-height: 1;">✅</div>
            </div>
            <h2 style="color: #16a34a; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">Payment Successful!</h2>
            <p style="color: #6b7280; margin: 0; font-size: 16px;">Thank you for your order, ${orderData.customer_name || 'Valued Customer'}!</p>
          </div>
          
          <!-- Order Summary Card -->
          <div style="background: linear-gradient(135deg, #f8fafc, #f1f5f9); border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📋</span>Order Summary
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Order Number</p>
                <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace;">${orderData.order_number}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Order Date</p>
                <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">${new Date(orderData.created_at).toLocaleDateString()}</p>
              </div>
              <div style="grid-column: 1 / -1;">
                <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Total Amount</p>
                <p style="margin: 0; color: #16a34a; font-size: 20px; font-weight: 700;">$${orderData.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <!-- Order Items -->
          <div style="margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
              <span style="margin-right: 8px;">🎁</span>Order Items
            </h3>
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: linear-gradient(135deg, #f8fafc, #f1f5f9);">
                    <th style="padding: 16px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #374151; font-weight: 600; font-size: 14px;">Item</th>
                    <th style="padding: 16px; text-align: center; border-bottom: 2px solid #e2e8f0; color: #374151; font-weight: 600; font-size: 14px;">Qty</th>
                    <th style="padding: 16px; text-align: right; border-bottom: 2px solid #e2e8f0; color: #374151; font-weight: 600; font-size: 14px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Shipping Information -->
          <div style="background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1px solid #bbf7d0; border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #16a34a;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
              <span style="margin-right: 8px;">🚚</span>Shipping Information
            </h3>
            <div style="color: #1f2937; font-size: 16px; line-height: 1.8;">
              <p style="margin: 0 0 5px 0; font-weight: 600;">${orderData.customer_name}</p>
              <p style="margin: 0 0 5px 0;">${orderData.billing_address.street}</p>
              <p style="margin: 0;">${orderData.billing_address.city}, ${orderData.billing_address.state} ${orderData.billing_address.zip_code}</p>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1px solid #bfdbfe; border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #3b82f6;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📞</span>Need Help?
            </h3>
            <p style="margin: 0 0 10px 0; color: #374151; font-size: 16px;">If you have any questions about your order, please contact us:</p>
            <div style="color: #1f2937; font-size: 16px; line-height: 1.8;">
              <p style="margin: 0 0 5px 0;"><strong>Email:</strong> support@christmastreeshop.com</p>
              <p style="margin: 0;"><strong>Phone:</strong> (555) 123-4567</p>
            </div>
          </div>
          
          <!-- Thank You Message -->
          <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; border: 1px solid #f59e0b;">
            <p style="margin: 0 0 10px 0; color: #92400e; font-size: 18px; font-weight: 600;">Thank you for choosing our Christmas Tree Shop!</p>
            <p style="margin: 0; color: #92400e; font-size: 16px;">🎅 Happy Holidays! 🎄</p>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #1f2937, #111827); padding: 30px; text-align: center;">
          <div style="margin-bottom: 15px;">
            <span style="color: #fbbf24; font-size: 20px; margin: 0 5px;">🎄</span>
            <span style="color: #fbbf24; font-size: 20px; margin: 0 5px;">⭐</span>
            <span style="color: #fbbf24; font-size: 20px; margin: 0 5px;">🎁</span>
          </div>
          <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
            Luxury Christmas Trees & Decor
          </p>
          <p style="color: #6b7280; margin: 0; font-size: 12px;">
            © 2025 Christmas Tree Shop. All rights reserved.
          </p>
        </div>
        
      </div>
      
    </body>
    </html>
  `
}

export function generateOrderConfirmationText(orderData: any) {
  // Ensure items is an array and handle undefined values
  const items = Array.isArray(orderData.items) ? orderData.items : []
  
  const itemsText = items.map((item: any) => {
    const productName = item.product_name || item.name || item.product?.name || 'Product Name Not Available'
    const quantity = item.quantity || 1
    const total = item.total || (item.price * quantity) || 0
    return `- ${productName} x${quantity} - $${total.toFixed(2)}`
  }).join('\n')

  return `
🎄 Order Confirmation - Indkan Xmas Trees

Dear ${orderData.customer_name || 'Valued Customer'},

Thank you for your order! Your payment has been processed successfully.

📋 Order Details:
Order Number: ${orderData.order_number || 'N/A'}
Order Date: ${orderData.created_at ? new Date(orderData.created_at).toLocaleDateString() : 'N/A'}
Total Amount: $${orderData.total ? orderData.total.toFixed(2) : '0.00'}

📦 Order Items:
${itemsText || 'No items found'}

🚚 Shipping Information:
${orderData.customer_name || 'N/A'}
${orderData.billing_address?.street || 'Address not available'}
${orderData.billing_address?.city || 'City not available'}, ${orderData.billing_address?.state || 'State not available'} ${orderData.billing_address?.zip_code || 'ZIP not available'}

📞 Contact Us:
If you have any questions, please contact us at support@indkanworldwideexim.com

Thank you for choosing Indkan Xmas Trees!
🎅 Happy Holidays!
  `.trim()
}
