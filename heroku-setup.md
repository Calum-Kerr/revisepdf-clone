# Heroku Deployment Instructions

Follow these steps to deploy the RevisePDF authentication system to Heroku:

## 1. Create a Heroku Account

If you don't already have a Heroku account, sign up at [heroku.com](https://heroku.com).

## 2. Install the Heroku CLI (Optional)

If you want to use the Heroku CLI, install it from [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli).

## 3. Create a New Heroku App

### Using the Heroku Dashboard:

1. Log in to your Heroku account
2. Click "New" > "Create new app"
3. Enter an app name (e.g., "revisepdf-clone")
4. Choose a region (United States or Europe)
5. Click "Create app"

### Using the Heroku CLI (Optional):

```bash
heroku create revisepdf-clone
```

## 4. Connect to GitHub

1. In the Heroku Dashboard, go to the "Deploy" tab
2. Select "GitHub" as the deployment method
3. Connect your GitHub account if not already connected
4. Search for and select your "revisepdf-clone" repository
5. Click "Connect"

## 5. Configure Environment Variables

1. In the Heroku Dashboard, go to the "Settings" tab
2. Click "Reveal Config Vars"
3. Add the following environment variables:

```
NEXTAUTH_SECRET=<generate-a-secure-random-string>
NEXTAUTH_URL=https://your-app-name.herokuapp.com
NEXT_PUBLIC_SUPABASE_URL=https://yrmgnrctqnrwjszdtqlq.supabase.co
SUPABASE_SERVICE_KEY=<your-supabase-service-key>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
EMAIL_SERVER_HOST=<your-smtp-host>
EMAIL_SERVER_PORT=<your-smtp-port>
EMAIL_SERVER_USER=<your-smtp-username>
EMAIL_SERVER_PASSWORD=<your-smtp-password>
EMAIL_SERVER_SECURE=false
EMAIL_FROM=noreply@revisepdf.com
NEXT_PUBLIC_DEFAULT_LOCALE=en-GB
```

## 6. Deploy the Application

1. In the Heroku Dashboard, go to the "Deploy" tab
2. Scroll down to "Manual deploy"
3. Select the branch you want to deploy (usually "master" or "main")
4. Click "Deploy Branch"
5. Wait for the deployment to complete

## 7. Enable Automatic Deploys (Optional)

1. In the Heroku Dashboard, go to the "Deploy" tab
2. Scroll down to "Automatic deploys"
3. Select the branch you want to automatically deploy
4. Check "Wait for CI to pass before deploy" if you have CI set up
5. Click "Enable Automatic Deploys"

## 8. Open the Application

1. In the Heroku Dashboard, click "Open app" in the top-right corner
2. Verify that the application is running correctly

## 9. Set Up the Supabase Database

1. Run the database setup script locally:

```bash
# Set the environment variables
export NEXT_PUBLIC_SUPABASE_URL=https://yrmgnrctqnrwjszdtqlq.supabase.co
export SUPABASE_SERVICE_KEY=<your-supabase-service-key>

# Run the setup script
node scripts/setup-database.js
```

## 10. Troubleshooting

If you encounter any issues:

1. Check the Heroku logs:
   - In the Heroku Dashboard, go to "More" > "View logs"
   - Or use the CLI: `heroku logs --tail`

2. Verify that all environment variables are set correctly

3. Make sure the Supabase database is set up correctly

4. Check that the application builds successfully locally:
   ```bash
   npm run build
   ```

## 11. Additional Resources

- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Heroku Next.js Deployment](https://devcenter.heroku.com/articles/deploying-nodejs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Supabase Documentation](https://supabase.io/docs)
