# Google OAuth Setup Guide

Follow these steps to enable Google Sign-In for your AgentPay application.

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "AgentPay" and click "Create"

## 2. Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and click on it
3. Click "Enable"

## 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type and click "Create"
3. Fill in the required fields:
   - **App name**: AgentPay
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click "Save and Continue"
5. Skip "Scopes" for now (click "Save and Continue")
6. Add test users if needed, then "Save and Continue"

## 4. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Name it "AgentPay Web Client"
5. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.com/api/auth/callback/google` (for production)
6. Click "Create"

## 5. Get Your Credentials

1. Copy the **Client ID** and **Client Secret**
2. Create a `.env.local` file in your project root
3. Add your credentials:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## 6. Test Google OAuth

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be redirected to the dashboard

## Required Scopes

The current setup requests these scopes:
- `openid` - Basic authentication
- `email` - User's email address
- `profile` - User's name and profile picture

## Phone Number Collection

Since Google doesn't always provide phone numbers, our app will:
1. Check if phone number is available from Google profile
2. If not, show a modal to collect it after successful Google sign-in
3. Save the phone number to the user's profile

## Production Setup

For production deployment:
1. Update the redirect URI to your production domain
2. Submit your app for verification if you need more than 100 users
3. Add your production domain to authorized domains
4. Update `NEXTAUTH_URL` to your production URL

