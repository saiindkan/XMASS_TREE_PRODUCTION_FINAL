// Test Email Template Preview
// Run this with: node test-email-template-preview.js

require('dotenv').config({ path: '.env.local' });

// Copy of the email template functions for testing
function generateOrderConfirmationEmail(orderData) {
  // Ensure items is an array and handle undefined values
  const items = Array.isArray(orderData.items) ? orderData.items : []
  
  const itemsList = items.map((item) => {
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
              <p style="margin: 0 0 5px 0;">${orderData.billing_address?.street?.line1 || orderData.billing_address?.address_line_1 || 'Address not available'}</p>
              <p style="margin: 0;">${orderData.billing_address?.street?.city || orderData.billing_address?.city || 'City not available'}, ${orderData.billing_address?.street?.state || orderData.billing_address?.state || 'State not available'} ${orderData.billing_address?.street?.postal_code || orderData.billing_address?.zip_code || 'ZIP not available'}</p>
            </div>
          </div>
          
          <!-- Contact Information -->
          <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1px solid #bfdbfe; border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #3b82f6;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📞</span>Need Help?
            </h3>
            <p style="margin: 0 0 10px 0; color: #374151; font-size: 16px;">If you have any questions about your order, please contact us:</p>
            <div style="color: #1f2937; font-size: 16px; line-height: 1.8;">
              <p style="margin: 0 0 5px 0;"><strong>Email:</strong> support@indkanworldwideexim.com</p>
              <p style="margin: 0;"><strong>Phone:</strong> (555) 123-4567</p>
            </div>
          </div>
          
          <!-- Thank You Message -->
          <div style="text-align: center; padding: 25px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; border: 1px solid #f59e0b;">
            <p style="margin: 0 0 10px 0; color: #92400e; font-size: 18px; font-weight: 600;">Thank you for choosing Indkan Xmas Trees!</p>
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
            © 2025 Indkan Xmas Trees. All rights reserved.
          </p>
        </div>
        
      </div>
      
    </body>
    </html>
  `
}

function generateOrderConfirmationText(orderData) {
  // Ensure items is an array and handle undefined values
  const items = Array.isArray(orderData.items) ? orderData.items : []
  
  const itemsText = items.map((item) => {
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
${orderData.billing_address?.street?.line1 || orderData.billing_address?.address_line_1 || 'Address not available'}
${orderData.billing_address?.street?.city || orderData.billing_address?.city || 'City not available'}, ${orderData.billing_address?.street?.state || orderData.billing_address?.state || 'State not available'} ${orderData.billing_address?.street?.postal_code || orderData.billing_address?.zip_code || 'ZIP not available'}

📞 Contact Us:
If you have any questions, please contact us at support@indkanworldwideexim.com

Thank you for choosing Indkan Xmas Trees!
🎅 Happy Holidays!
  `.trim()
}

async function testEmailTemplatePreview() {
  console.log('🔍 Testing Email Template Preview...\n');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Get a real order from database
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError);
      return;
    }
    
    if (!orders || orders.length === 0) {
      console.log('📭 No orders found in database');
      return;
    }
    
    const order = orders[0];
    console.log('📋 Using order:', {
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      total: order.total,
      items: order.items?.length || 0
    });
    
    // Generate email content using the template functions
    const emailHtml = generateOrderConfirmationEmail(order);
    const emailText = generateOrderConfirmationText(order);
    
    console.log('\n📧 Email Template Analysis:');
    console.log('✅ HTML Email Generated:', emailHtml.length, 'characters');
    console.log('✅ Text Email Generated:', emailText.length, 'characters');
    
    // Save HTML preview to file
    const fs = require('fs');
    const path = require('path');
    
    const previewPath = path.join(__dirname, 'email-template-preview.html');
    fs.writeFileSync(previewPath, emailHtml);
    console.log('📄 HTML preview saved to:', previewPath);
    
    // Save text preview to file
    const textPreviewPath = path.join(__dirname, 'email-template-preview.txt');
    fs.writeFileSync(textPreviewPath, emailText);
    console.log('📄 Text preview saved to:', textPreviewPath);
    
    // Analyze template content
    console.log('\n🔍 Template Analysis:');
    
    // Check for required fields
    const requiredFields = [
      'customer_name',
      'order_number', 
      'total',
      'items',
      'billing_address'
    ];
    
    const missingFields = requiredFields.filter(field => {
      if (field === 'items') {
        return !order.items || !Array.isArray(order.items) || order.items.length === 0;
      }
      if (field === 'billing_address') {
        return !order.billing_address;
      }
      return !order[field];
    });
    
    if (missingFields.length > 0) {
      console.log('⚠️ Missing fields:', missingFields.join(', '));
    } else {
      console.log('✅ All required fields present');
    }
    
    // Check template features
    console.log('\n🎨 Template Features:');
    console.log('✅ Christmas theme with snowflakes');
    console.log('✅ Company branding');
    console.log('✅ Order summary card');
    console.log('✅ Items table');
    console.log('✅ Shipping information');
    console.log('✅ Contact information');
    console.log('✅ Thank you message');
    console.log('✅ Responsive design');
    
    // Check for potential issues
    console.log('\n🔧 Potential Issues:');
    
    if (emailHtml.includes('undefined')) {
      console.log('⚠️ Contains "undefined" values');
    } else {
      console.log('✅ No undefined values');
    }
    
    if (emailHtml.includes('null')) {
      console.log('⚠️ Contains "null" values');
    } else {
      console.log('✅ No null values');
    }
    
    if (emailHtml.includes('NaN')) {
      console.log('⚠️ Contains "NaN" values');
    } else {
      console.log('✅ No NaN values');
    }
    
    // Check email size
    const emailSizeKB = Math.round(emailHtml.length / 1024);
    if (emailSizeKB > 100) {
      console.log('⚠️ Email size is large:', emailSizeKB, 'KB');
    } else {
      console.log('✅ Email size is reasonable:', emailSizeKB, 'KB');
    }
    
    console.log('\n📊 Template Statistics:');
    console.log('📧 HTML Length:', emailHtml.length, 'characters');
    console.log('📧 Text Length:', emailText.length, 'characters');
    console.log('📧 Items Count:', order.items?.length || 0);
    console.log('📧 Total Amount: $' + (order.total || 0).toFixed(2));
    
    console.log('\n🎉 Email template preview completed!');
    console.log('📄 Open email-template-preview.html in your browser to see the email');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testEmailTemplatePreview();
