# Email Templates for Verde Invite System

This document contains email templates for the brand and customer invite flows.

---

## Brand Admin/Manager Invite

**Subject:** You've been invited to manage a brand on Verde

**Body:**

```
Hi {{name}},

You've been invited to manage {{brand_name}} on Verde.

Accept your invitation here:
{{host}}/accept-brand-invite?token={{token}}

This link expires on {{expires_at}}.

If you didn't expect this invitation, you can safely ignore this email.

Best regards,
The Verde Team
```

**Variables:**

- `{{name}}` - Recipient's name or email
- `{{brand_name}}` - Name of the brand they're being invited to
- `{{host}}` - Application domain (e.g., `https://verde.yourdomain.com`)
- `{{token}}` - Unique invite token
- `{{expires_at}}` - Expiration date (14 days from creation)

---

## Customer Invite

**Subject:** Welcome to {{brand_name}} on Verde

**Body:**

```
Hi {{name}},

You've been invited to shop with {{brand_name}} on Verde.

Join here:
{{host}}/accept-invite?token={{token}}

This link expires on {{expires_at}}.

Get ready to discover premium cannabis products with personalized recommendations and seamless delivery.

If you didn't request this invitation, you can safely ignore this email.

Best regards,
{{brand_name}}
```

**Variables:**

- `{{name}}` - Recipient's name or email
- `{{brand_name}}` - Name of the brand they're being invited to
- `{{host}}` - Application domain
- `{{token}}` - Unique invite token
- `{{expires_at}}` - Expiration date (30 days from creation)

---

## Implementation Examples

### Using Supabase Edge Functions

```typescript
// supabase/functions/send-brand-invite/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { email, brandName, token, expiresAt } = await req.json();

  const html = `
    <p>Hi ${email},</p>
    <p>You've been invited to manage <strong>${brandName}</strong> on Verde.</p>
    <p>Accept your invitation here:<br>
    <a href="${Deno.env.get("APP_URL")}/accept-brand-invite?token=${token}">
      ${Deno.env.get("APP_URL")}/accept-brand-invite?token=${token}
    </a></p>
    <p>This link expires on ${expiresAt}.</p>
  `;

  // Send email via your email service (SendGrid, Resend, etc.)
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("SENDGRID_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email }],
          subject: "You've been invited to manage a brand on Verde",
        },
      ],
      from: { email: "noreply@verde.com", name: "Verde Team" },
      content: [{ type: "text/html", value: html }],
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### Using Resend

```typescript
// src/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export async function sendBrandInvite({
  email,
  brandName,
  token,
  expiresAt,
}: {
  email: string;
  brandName: string;
  token: string;
  expiresAt: string;
}) {
  await resend.emails.send({
    from: "Verde <noreply@verde.com>",
    to: email,
    subject: "You've been invited to manage a brand on Verde",
    html: `
      <p>Hi ${email},</p>
      <p>You've been invited to manage <strong>${brandName}</strong> on Verde.</p>
      <p>Accept your invitation here:<br>
      <a href="${window.location.origin}/accept-brand-invite?token=${token}">
        Accept Invitation
      </a></p>
      <p>This link expires on ${expiresAt}.</p>
      <p>If you didn't expect this invitation, you can safely ignore this email.</p>
    `,
  });
}

export async function sendCustomerInvite({
  email,
  brandName,
  token,
  expiresAt,
}: {
  email: string;
  brandName: string;
  token: string;
  expiresAt: string;
}) {
  await resend.emails.send({
    from: `${brandName} <noreply@verde.com>`,
    to: email,
    subject: `Welcome to ${brandName} on Verde`,
    html: `
      <p>Hi ${email},</p>
      <p>You've been invited to shop with <strong>${brandName}</strong> on Verde.</p>
      <p>Join here:<br>
      <a href="${window.location.origin}/accept-invite?token=${token}">
        Join ${brandName}
      </a></p>
      <p>This link expires on ${expiresAt}.</p>
      <p>Get ready to discover premium cannabis products with personalized recommendations and seamless delivery.</p>
    `,
  });
}
```

### Usage in BrandDashboard

```typescript
import { sendBrandInvite, sendCustomerInvite } from "@/lib/email";

// Create and send brand invite
async function inviteBrandMember(email: string) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const { error } = await supabase.from("brand_invites").insert({
    brand_id: brandId,
    email,
    token,
    created_by: (await supabase.auth.getUser()).data.user?.id,
  });

  if (!error) {
    await sendBrandInvite({
      email,
      brandName: "Your Brand Name",
      token,
      expiresAt: expiresAt.toLocaleDateString(),
    });
  }
}

// Create and send customer invite
async function inviteCustomer(email: string) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const { error } = await supabase.from("customer_invites").insert({
    brand_id: brandId,
    email,
    token,
    created_by: (await supabase.auth.getUser()).data.user?.id,
  });

  if (!error) {
    await sendCustomerInvite({
      email,
      brandName: "Your Brand Name",
      token,
      expiresAt: expiresAt.toLocaleDateString(),
    });
  }
}
```

---

## HTML Email Templates (Enhanced)

### Brand Invite (HTML)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Brand Invite - Verde</title>
  </head>
  <body
    style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"
  >
    <div
      style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;"
    >
      <h1 style="color: white; margin: 0; font-size: 28px;">Verde</h1>
    </div>

    <div
      style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;"
    >
      <h2 style="margin-top: 0; color: #1f2937;">You've been invited!</h2>

      <p>Hi {{name}},</p>

      <p>
        You've been invited to manage <strong>{{brand_name}}</strong> on Verde's cannabis
        marketplace platform.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="{{host}}/accept-brand-invite?token={{token}}"
          style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;"
        >
          Accept Invitation
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px;">
        Or copy this link:<br />
        <code
          style="background: #f3f4f6; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-top: 8px; word-break: break-all;"
          >{{host}}/accept-brand-invite?token={{token}}</code
        >
      </p>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        This invitation expires on <strong>{{expires_at}}</strong>.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

      <p style="color: #9ca3af; font-size: 12px;">
        If you didn't expect this invitation, you can safely ignore this email.
      </p>
    </div>
  </body>
</html>
```

### Customer Invite (HTML)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to {{brand_name}} - Verde</title>
  </head>
  <body
    style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"
  >
    <div
      style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;"
    >
      <h1 style="color: white; margin: 0; font-size: 28px;">{{brand_name}}</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">on Verde</p>
    </div>

    <div
      style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;"
    >
      <h2 style="margin-top: 0; color: #1f2937;">Welcome!</h2>

      <p>Hi {{name}},</p>

      <p>You've been invited to shop with <strong>{{brand_name}}</strong> on Verde.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="{{host}}/accept-invite?token={{token}}"
          style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;"
        >
          Join Now
        </a>
      </div>

      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <p style="margin: 0; color: #4b5563; font-size: 14px;">
          ✨ Premium cannabis products<br />
          🚀 Fast, discreet delivery<br />
          💎 Exclusive member benefits
        </p>
      </div>

      <p style="color: #6b7280; font-size: 14px;">
        Or copy this link:<br />
        <code
          style="background: #f3f4f6; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-top: 8px; word-break: break-all;"
          >{{host}}/accept-invite?token={{token}}</code
        >
      </p>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        This invitation expires on <strong>{{expires_at}}</strong>.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

      <p style="color: #9ca3af; font-size: 12px;">
        If you didn't request this invitation, you can safely ignore this email.
      </p>
    </div>
  </body>
</html>
```

---

## Testing Email Templates

### Local Development

For local testing, you can log emails to console instead of sending:

```typescript
// src/lib/email.dev.ts
export async function sendBrandInvite(params: any) {
  console.log("📧 Brand Invite Email:", {
    to: params.email,
    subject: "You've been invited to manage a brand on Verde",
    link: `${window.location.origin}/accept-brand-invite?token=${params.token}`,
  });
}
```

### Using MailHog (Docker)

```bash
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
# Configure SMTP: localhost:1025
# View emails: http://localhost:8025
```

---

## Security Notes

- ✅ Always use HTTPS for invite links
- ✅ Tokens should be cryptographically random (UUID v4 or better)
- ✅ Include expiration dates in emails
- ✅ Never include sensitive data in email body
- ✅ Use SPF/DKIM/DMARC for email authentication
- ✅ Rate limit invite generation (prevent spam)

---

**Last Updated:** 2025-10-16
