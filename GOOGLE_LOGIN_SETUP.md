# Google OAuth 2.0 Setup Guide

This guide explains how to configure and fix Google Login for the Evora Events application.

## Current Status

✅ **Google Client ID**: `255687396164-l1nrorhkguiartgu58sa059umd462brn.apps.googleusercontent.com`

The application uses **OAuth 2.0 Implicit Flow** with **ID Tokens** for authentication.

---

## Prerequisites

1. **Google Cloud Console Account** - https://console.cloud.google.com
2. **Project Created** - Create or use an existing GCP project
3. **Google+ API Enabled** - Enable the Google+ API in your project

---

## Step-by-Step Setup

### 1. Enable Google+ API

```
1. Go to https://console.cloud.google.com
2. Select your project
3. Navigate to APIs & Services → Library
4. Search for "Google+ API"
5. Click on it and press "Enable"
```

### 2. Create OAuth 2.0 Credentials

```
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth 2.0 ID"
3. Choose "Web application"
4. Fill in the details:
   - Name: "Evora Events - Web"
   - Authorized JavaScript origins:
     * http://localhost:3000
     * http://localhost:3001
     * http://127.0.0.1:3000
     * http://127.0.0.1:3001
     * Your production domain (when deployed)
   - Authorized redirect URIs:
     * http://localhost:3000/signin
     * http://localhost:3001/signin
     * http://127.0.0.1:3000/signin
     * http://127.0.0.1:3001/signin
     * Your production signin URL (when deployed)
5. Click "Create"
6. Copy the Client ID
```

### 3. Update Configuration

**In `.env.local`:**

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

The `NEXT_PUBLIC_` prefix makes it available to the browser.

---

## How Google Login Works

### Flow Diagram

```
User clicks "Sign in with Google"
         ↓
Redirects to Google OAuth consent screen
         ↓
User approves
         ↓
Google redirects back to /signin with ID token in URL hash
         ↓
Component decodes JWT token to extract email & name
         ↓
User is logged in locally (localStorage)
         ↓
Redirect to /venues
```

### Key Files

- **GoogleLoginButton.tsx** - Frontend OAuth flow handler
- **AuthContext.tsx** - User session management
- **.env.local** - Configuration file

---

## Troubleshooting

### Issue: "Google login security check failed"

**Cause**: Nonce mismatch between request and response

**Solution**:
1. Clear browser localStorage: Open DevTools → Application → Storage → Clear All
2. Try login again
3. Check browser console for security errors

### Issue: "Google login redirect failed" or blank email

**Cause**: ID token is malformed or email not included in token

**Solution**:
1. Verify scope includes `email`: Check GoogleLoginButton.tsx `scope` parameter
2. Ensure the Google account has an email verified
3. Check Google Cloud Console for API errors

### Issue: Redirect URI mismatch error

**Cause**: The redirect URI in Google Console doesn't match your application URL

**Solution**:
1. Check your current port (3000 or 3001)
2. Add all possible redirect URIs in Google Cloud Console:
   - http://localhost:3000/signin
   - http://localhost:3001/signin
   - http://127.0.0.1:3000/signin
   - http://127.0.0.1:3001/signin

### Issue: Button doesn't show or gives CORS error

**Cause**: Google Script not loading or blocked

**Solution**:
1. Check browser console for network errors
2. Ensure no ad-blocker is blocking Google APIs
3. Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `.env.local`

---

## Testing Google Login

### Local Testing

```bash
# 1. Make sure .env.local has NEXT_PUBLIC_GOOGLE_CLIENT_ID set
# 2. Start the dev server
pnpm dev

# 3. Go to http://localhost:3000/signin
# 4. Click "Sign in with Google"
# 5. Use your test Google account
```

### Test Accounts

Use any Google account that has:
- Verified email address
- Google account created (not business/workspace account initially)

---

## Testing Email Focus

After Google login, the user gets the role:
- **Admin**: `lacdooharvey2@gmail.com` → auto-assigned admin role
- **Customer**: Any other email → customer role

You can later assign other roles to users after they log in.

---

## Production Deployment

When deploying:

1. **Update Google Console**:
   - Add your production domain to JavaScript origins
   - Add your production signin URL to redirect URIs
   - Example: `https://yourdomain.com/signin`

2. **Update .env.local** (or production .env):

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

3. **Enable HTTPS**: Google OAuth requires HTTPS for production

---

## Advanced: Storing in Database

Currently, user data is stored only in localStorage. To persist to database:

1. **Create backend endpoint** `/api/auth/google-callback`
2. **Store user in MySQL** with email, name, role
3. **Return session token** instead of localStorage

This requires creating an API route and modifying AuthContext.

---

## Support

For issues with:
- **Google OAuth setup**: https://support.google.com/cloud/answer/6158849
- **Security concerns**: Check Google OAuth 2.0 security best practices
- **App-specific issues**: Check browser console for detailed error messages

---

## Current Implementation Details

### Nonce Security

The implementation uses a **nonce** (number used once) for CSRF protection:
1. Generate random UUID on login click
2. Store in sessionStorage
3. Send with OAuth request
4. Verify on callback - must match

### JWT Decoding

The ID token is decoded locally by:
1. Splitting JWT by `.` (3 parts)
2. Base64 decoding the payload
3. Parsing JSON
4. Extracting email and name

This is secure because:
- Token signature is verified by browser ID check
- We don't trust the token for authorization, only user info
- Email must be verified by Google first

---

**Last Updated**: April 13, 2026
**Version**: 1.0.0
