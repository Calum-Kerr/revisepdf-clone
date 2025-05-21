# RevisePDF Production Deployment Guide

This guide outlines the steps needed to deploy the RevisePDF application to production.

## Prerequisites

- Heroku account
- Git installed locally
- Node.js and npm installed locally
- Supabase project set up (already done)

## Environment Configuration

The application has been configured with two environment files:

1. `.env.local` - For local development
2. `.env.production` - For production deployment

The production environment should be configured with:
- `NEXTAUTH_DEMO_MODE=false` - Disables demo mode
- `NEXTAUTH_URL` set to your production URL
- Proper email configuration
- Supabase configuration

## Deployment Steps

### 1. Push to GitHub

The changes have been committed to the repository. Push them to GitHub:

```bash
git push origin master
```

### 2. Deploy to Heroku

#### Option 1: Deploy from GitHub

1. Log in to your Heroku account
2. Create a new app (if not already created)
3. Connect your GitHub repository
4. Enable automatic deploys from the master branch
5. Manually deploy the master branch for the first time

#### Option 2: Deploy using Heroku CLI

1. Install the Heroku CLI if not already installed
2. Log in to Heroku:
   ```bash
   heroku login
   ```
3. Add the Heroku remote:
   ```bash
   heroku git:remote -a your-app-name
   ```
4. Push to Heroku:
   ```bash
   git push heroku master
   ```

### 3. Configure Environment Variables on Heroku

Set the following environment variables in the Heroku dashboard:

- `NEXTAUTH_URL`: Your application URL (e.g., https://your-app-name.herokuapp.com)
- `NEXTAUTH_SECRET`: A secure random string for session encryption
- `NEXTAUTH_DEMO_MODE`: Set to "false" for production
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Your Supabase service key
- `EMAIL_SERVER_HOST`: SMTP server host
- `EMAIL_SERVER_PORT`: SMTP server port
- `EMAIL_SERVER_USER`: SMTP server username
- `EMAIL_SERVER_PASSWORD`: SMTP server password
- `EMAIL_SERVER_SECURE`: Whether to use SSL for SMTP (true/false)
- `EMAIL_FROM`: Email sender address
- `NEXT_PUBLIC_DEFAULT_LOCALE`: Default locale (e.g., en-GB)
- `NODE_ENV`: Set to "production"

### 4. Verify Deployment

1. Open the application in your browser: https://your-app-name.herokuapp.com
2. Test user registration and login
3. Test profile updates
4. Test other application features

## Post-Deployment Tasks

### 1. Set Up a Custom Domain (Optional)

1. Purchase a domain name if you don't already have one
2. Add the domain to your Heroku app:
   ```bash
   heroku domains:add www.yourdomain.com
   ```
3. Configure DNS settings with your domain provider
4. Update `NEXTAUTH_URL` to your custom domain

### 2. Set Up Production Email Provider

For production, consider switching from Mailtrap to a production email provider:

1. Sign up for a service like SendGrid, Mailgun, or Amazon SES
2. Update the email configuration in Heroku environment variables

### 3. Monitor Application Performance

1. Set up Heroku metrics and logging
2. Consider adding application monitoring tools

## Troubleshooting

### Authentication Issues

If users are having trouble logging in:

1. Check that `NEXTAUTH_URL` is set correctly
2. Verify that `NEXTAUTH_SECRET` is set
3. Check that Google OAuth credentials are correct
4. Verify that Supabase connection is working

### Database Issues

If there are issues with the database:

1. Check Supabase connection settings
2. Verify that the service key is valid
3. Check database tables and permissions

## Security Considerations

1. Keep your environment variables secure
2. Regularly update dependencies
3. Monitor for suspicious activity
4. Consider enabling two-factor authentication for your Heroku and GitHub accounts

## Backup and Recovery

1. Regularly backup your Supabase database
2. Document the deployment process for recovery purposes
3. Consider setting up a staging environment for testing changes before production
