# Setting Up Supabase Email Service for RevisePDF

This guide explains how to configure Supabase's built-in email service for the RevisePDF application.

## Overview

RevisePDF now uses Supabase's email service for all authentication-related emails, including:
- Email verification
- Password reset

This replaces the previous Mailtrap/Nodemailer implementation, simplifying the codebase and reducing dependencies.

## Prerequisites

1. A Supabase project
2. Admin access to your Supabase project
3. A verified email domain (for production)

## Configuration Steps

### 1. Set Up Email Provider in Supabase

1. Log in to your [Supabase dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** > **Email Templates**
4. Click on **Email Provider** tab
5. Choose your email provider:
   - For development: You can use the default Supabase SMTP server
   - For production: Configure a custom SMTP server (SendGrid, Mailgun, etc.)

### 2. Configure Email Templates

Supabase provides customizable email templates for different authentication flows. You need to configure:

#### Confirmation Template (for Email Verification)

1. Navigate to **Authentication** > **Email Templates**
2. Select the **Confirmation** template
3. Customize the template with your branding:

```html
<h2>Confirm your email address</h2>
<p>Follow this link to confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm email address</a></p>
<p>If you didn't request this email, you can safely ignore it.</p>
<p>Regards,<br>The RevisePDF Team</p>
```

4. Update the subject line: "Confirm your email address for RevisePDF"

#### Recovery Template (for Password Reset)

1. Navigate to **Authentication** > **Email Templates**
2. Select the **Recovery** template
3. Customize the template with your branding:

```html
<h2>Reset your password</h2>
<p>Follow this link to reset the password for your account:</p>
<p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
<p>If you didn't request a password reset, you can safely ignore this email.</p>
<p>Regards,<br>The RevisePDF Team</p>
```

4. Update the subject line: "Reset your password for RevisePDF"

### 3. Configure Email Settings in Environment Variables

Update your environment variables:

```
# Email Configuration
EMAIL_FROM=noreply@yourdomain.com
# Note: Email sending is handled by Supabase - no additional SMTP configuration needed
```

Make sure the `EMAIL_FROM` address matches the sender email configured in your Supabase email provider.

### 4. Verify Your Domain (Production Only)

For production environments, you should verify your domain to improve email deliverability:

1. Navigate to **Authentication** > **Email Templates** > **Email Provider**
2. Click on **Sender Domains**
3. Add your domain and follow the verification steps

## Testing Email Functionality

To test that emails are being sent correctly:

1. Register a new user account
2. Check that you receive a verification email
3. Click the verification link and confirm it works
4. Test the password reset flow

## Troubleshooting

If emails are not being sent or received:

1. Check Supabase logs for any errors
2. Verify that your email provider is configured correctly
3. Check spam folders for test emails
4. Ensure your domain is properly verified (for production)
5. Confirm that the `EMAIL_FROM` environment variable matches your Supabase configuration

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Email Deliverability Best Practices](https://supabase.com/docs/guides/auth/auth-smtp#email-deliverability)
