/**
 * Email service integration for Verde invite system
 * 
 * Setup:
 * 1. Install: npm install resend
 * 2. Set VITE_RESEND_API_KEY in your .env file
 * 3. Verify sender domain in Resend dashboard
 */

const PUBLIC_HOST = import.meta.env.VITE_PUBLIC_HOST || window.location.origin;

interface BrandInviteParams {
  email: string;
  brandName: string;
  token: string;
  expiresAt: string;
}

interface CustomerInviteParams {
  email: string;
  brandName: string;
  token: string;
  expiresAt: string;
}

/**
 * Send brand admin/manager invite email
 */
export async function sendBrandInvite({
  email,
  brandName,
  token,
  expiresAt,
}: BrandInviteParams): Promise<{ success: boolean; error?: string }> {
  const inviteUrl = `${PUBLIC_HOST}/accept-brand-invite?token=${token}`;
  
  // TODO: Replace with your email service
  // Example using Resend:
  /*
  const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'Verde <noreply@verde.com>',
    to: email,
    subject: `You've been invited to manage ${brandName}`,
    html: getBrandInviteTemplate({ email, brandName, inviteUrl, expiresAt }),
  });
  */
  
  // Development fallback: log to console
  if (import.meta.env.DEV) {
    console.log('📧 Brand Invite Email:', {
      to: email,
      subject: `You've been invited to manage ${brandName}`,
      inviteUrl,
      expiresAt,
    });
  }
  
  return { success: true };
}

/**
 * Send customer invite email
 */
export async function sendCustomerInvite({
  email,
  brandName,
  token,
  expiresAt,
}: CustomerInviteParams): Promise<{ success: boolean; error?: string }> {
  const inviteUrl = `${PUBLIC_HOST}/accept-invite?token=${token}`;
  
  // TODO: Replace with your email service
  // Example using Resend:
  /*
  const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);
  
  await resend.emails.send({
    from: `${brandName} <noreply@verde.com>`,
    to: email,
    subject: `Welcome to ${brandName} on Verde`,
    html: getCustomerInviteTemplate({ email, brandName, inviteUrl, expiresAt }),
  });
  */
  
  // Development fallback: log to console
  if (import.meta.env.DEV) {
    console.log('📧 Customer Invite Email:', {
      to: email,
      subject: `Welcome to ${brandName} on Verde`,
      inviteUrl,
      expiresAt,
    });
  }
  
  return { success: true };
}

/**
 * Brand invite HTML email template
 */
function getBrandInviteTemplate({
  email,
  brandName,
  inviteUrl,
  expiresAt,
}: {
  email: string;
  brandName: string;
  inviteUrl: string;
  expiresAt: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brand Invite - Verde</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Verde</h1>
  </div>
  
  <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="margin-top: 0; color: #1f2937;">You've been invited!</h2>
    
    <p>Hi ${email},</p>
    
    <p>You've been invited to manage <strong>${brandName}</strong> on Verde's cannabis marketplace platform.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${inviteUrl}" 
         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Accept Invitation
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      Or copy this link:<br>
      <code style="background: #f3f4f6; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-top: 8px; word-break: break-all; font-size: 12px;">${inviteUrl}</code>
    </p>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      This invitation expires on <strong>${expiresAt}</strong>.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #9ca3af; font-size: 12px;">
      If you didn't expect this invitation, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Customer invite HTML email template
 */
function getCustomerInviteTemplate({
  email,
  brandName,
  inviteUrl,
  expiresAt,
}: {
  email: string;
  brandName: string;
  inviteUrl: string;
  expiresAt: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${brandName} - Verde</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">${brandName}</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">on Verde</p>
  </div>
  
  <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="margin-top: 0; color: #1f2937;">Welcome!</h2>
    
    <p>Hi ${email},</p>
    
    <p>You've been invited to shop with <strong>${brandName}</strong> on Verde.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${inviteUrl}" 
         style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Join Now
      </a>
    </div>
    
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <p style="margin: 0; color: #4b5563; font-size: 14px;">
        ✨ Premium cannabis products<br>
        🚀 Fast, discreet delivery<br>
        💎 Exclusive member benefits
      </p>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      Or copy this link:<br>
      <code style="background: #f3f4f6; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-top: 8px; word-break: break-all; font-size: 12px;">${inviteUrl}</code>
    </p>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      This invitation expires on <strong>${expiresAt}</strong>.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #9ca3af; font-size: 12px;">
      If you didn't request this invitation, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
  `.trim();
}

