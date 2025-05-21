# RevisePDF Authentication System

This document provides an overview of the authentication system for the RevisePDF application.

## Overview

The authentication system is built using:

- **NextAuth.js**: For authentication and session management
- **Supabase**: For database storage
- **Next.js Middleware**: For route protection and locale handling
- **British English (en-GB)**: As the default locale

## Features

- User registration with email verification
- Email/password authentication
- Google OAuth authentication
- Password reset functionality
- User profile management
- Session management
- Locale-based routing
- Protected routes

## Setup Instructions

### 1. Environment Variables

Create or update your `.env.local` file with the following variables:

```
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-next-auth-secret-key-change-in-production
NEXTAUTH_DEMO_MODE=false

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yrmgnrctqnrwjszdtqlq.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key

# Email Service Configuration
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email-username
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_SERVER_SECURE=false
EMAIL_FROM=noreply@revisepdf.com

# Locale Configuration
NEXT_PUBLIC_DEFAULT_LOCALE=en-GB
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

### 3. Set Up Supabase Database

Run the database setup script:

```bash
node scripts/setup-database.js
```

This will create the necessary tables, functions, triggers, and policies in your Supabase database.

## Authentication Flow

### Registration

1. User fills out the registration form
2. Form data is validated on the client-side
3. Registration request is sent to the API
4. Server validates the data and creates a new user in the database
5. Verification email is sent to the user
6. User clicks the verification link in the email
7. Email is verified and user can now log in

### Login

1. User enters email and password
2. Credentials are validated against the database
3. If valid, a session is created and the user is redirected to the homepage
4. If invalid, an error message is displayed

### Password Reset

1. User requests a password reset
2. Reset link is sent to the user's email
3. User clicks the link and enters a new password
4. Password is updated in the database

## Protected Routes

The following routes are protected and require authentication:

- `/dashboard/*`
- `/account/*`

## API Routes

- `/api/auth/[...nextauth]`: NextAuth.js API routes
- `/api/auth/register`: User registration
- `/api/auth/verify-email`: Email verification
- `/api/auth/forgot-password`: Password reset request
- `/api/auth/reset-password`: Password reset
- `/api/auth/profile`: User profile management

## Components

- `AuthStatus`: Displays the user's authentication status and provides login/logout functionality
- `UserMenu`: Dropdown menu for authenticated users

## Utilities

- `getSession()`: Get the current session on the server
- `requireAuth()`: Check if the user is authenticated on the server and redirect if not
- `checkAuth()`: Check if the user is authenticated on the server
- `getCurrentUser()`: Get the current user from the session on the server
- `redirectIfAuthenticated()`: Redirect if the user is already authenticated
- `getLocaleFromPath()`: Get the locale from the URL path

## Demo Mode

The application includes a demo mode that can be enabled by setting `NEXTAUTH_DEMO_MODE=true` in the `.env.local` file. In demo mode, the application will use mock authentication instead of real authentication.

## Localization

The authentication system is integrated with the application's localization system. The default locale is British English (en-GB), and all authentication-related pages and emails are available in multiple languages.

## Security Considerations

- Passwords are hashed using bcrypt
- CSRF protection is enabled
- Rate limiting is implemented for authentication endpoints
- Secure HTTP headers are set
- Row Level Security (RLS) is implemented in the database

## Troubleshooting

If you encounter any issues with the authentication system, check the following:

1. Make sure all environment variables are set correctly
2. Check the server logs for any errors
3. Verify that the Supabase database is set up correctly
4. Ensure that the email service is configured properly

For more detailed information, refer to the [NextAuth.js documentation](https://next-auth.js.org/getting-started/introduction) and the [Supabase documentation](https://supabase.io/docs).
