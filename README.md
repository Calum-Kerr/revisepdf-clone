# RevisePDF Authentication System

A comprehensive authentication system for the RevisePDF application, built with Next.js, NextAuth.js, and Supabase.

## Features

- User registration with email verification
- Email/password authentication
- Google OAuth authentication
- Password reset functionality
- User profile management
- Session management
- Locale-based routing with British English (en-GB) as the default
- Protected routes

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: Supabase
- **Email**: Nodemailer
- **Localisation**: next-intl

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account
- SMTP server for email functionality

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Calum-Kerr/revisepdf-clone.git
cd revisepdf-clone
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with the following variables:

```
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-next-auth-secret-key-change-in-production
NEXTAUTH_DEMO_MODE=false

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
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

4. Set up the Supabase database:

```bash
node scripts/setup-database.js
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Heroku

This project is configured for deployment on Heroku:

1. Create a new Heroku app
2. Connect your GitHub repository to Heroku
3. Set the environment variables in the Heroku dashboard
4. Deploy the application

## Project Structure

- `/src/app/api/auth`: Authentication API routes
- `/src/app/auth`: Authentication pages
- `/src/components/auth`: Authentication components
- `/src/lib`: Utility functions
- `/supabase`: Supabase database schema
- `/scripts`: Setup scripts
- `/docs`: Documentation

## Documentation

For more detailed information, see the [authentication documentation](docs/authentication.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
