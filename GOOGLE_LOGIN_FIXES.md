# Google Login - Quick Fix Checklist

## ✅ Current Status

The Google login has been **configured and improved** with:
- ✅ Environment variable support (`NEXT_PUBLIC_GOOGLE_CLIENT_ID`)
- ✅ Enhanced error handling with detailed messages
- ✅ Debug mode for troubleshooting (`?debug_google` URL parameter)
- ✅ Better security (nonce validation, JWT decoding)
- ✅ Comprehensive error recovery

---

## 🔧 Quick Setup (5 Minutes)

### 1. Update Environment Variables

**File**: `.env.local`

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=255687396164-l1nrorhkguiartgu58sa059umd462brn.apps.googleusercontent.com
```

### 2. Restart Dev Server

```bash
# Kill current server (Ctrl+C)
# Clear cache
rm -rf .next

# Restart
pnpm dev
```

### 3. Test Google Login

```
1. Go to http://localhost:3000/signin
2. Click "Sign in with Google"
3. Use your Google account
4. Should redirect to /venues
```

---

## 🐛 Debug Mode

### Enable Debug Logging

Go to: `http://localhost:3000/signin?debug_google`

This will:
- Show debug panel below the button
- Log OAuth flow steps to console
- Display Client ID confirmation

**Open DevTools** (F12) and check Console tab for detailed logs.

---

## ❌ Common Issues & Fixes

### Issue 1: "Google Client ID not configured"

**Button is disabled with this message**

**Fix**:
```bash
# 1. Check .env.local
cat .env.local | grep GOOGLE

# 2. Should see:
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=255687396164-...

# 3. If missing, add it:
echo 'NEXT_PUBLIC_GOOGLE_CLIENT_ID=255687396164-l1nrorhkguiartgu58sa059umd462brn.apps.googleusercontent.com' >> .env.local

# 4. Restart server
# Kill: Ctrl+C
# Start: pnpm dev
```

### Issue 2: "Security verification failed" or nonce error

**Error appears after clicking button and returning from Google**

**Fix** (in order):
```
1. Clear browser data:
   - Open DevTools (F12)
   - Go to Application tab
   - Storage → Clear Site Data
   
2. Close and reopen browser/tab

3. Try again on http://localhost:3000/signin

4. If still fails:
   - rm -rf .next
   - pnpm dev
   - Try again
```

### Issue 3: "No email found in credentials"

**Error: "No email found in credentials. Please ensure your Google account has a verified email."**

**Fix**:
```
1. Use a personal Google account (not Workspace/Gmail Business)
2. Make sure email is verified in Google account
3. Try with a different Google account
4. Check Google account settings: myaccount.google.com
```

### Issue 4: "Redirect URI mismatch" from Google

**Error message from Google during OAuth flow**

**Fix**:
```
1. Check which port you're on:
   - http://localhost:3000 (default)
   - http://localhost:3001 (if 3000 is busy)

2. Go to Google Cloud Console:
   https://console.cloud.google.com

3. Find OAuth Client ID: 255687396164-l1nrorhkguiartgu58sa059umd462brn

4. Edit and add these Authorized redirect URIs:
   - http://localhost:3000/signin
   - http://localhost:3001/signin
   - http://127.0.0.1:3000/signin
   - http://127.0.0.1:3001/signin

5. Save and try again
```

---

## 🔍 Step-by-Step Testing

### Test 1: Component Renders

```
1. Go to http://localhost:3000/signin
2. You should see a "Sign in with Google" button
3. Button should be enabled (not grayed out)
```

**If button is missing or grayed out**:
- Check browser console for errors (F12 → Console)
- Verify NEXT_PUBLIC_GOOGLE_CLIENT_ID is set
- Restart dev server

### Test 2: OAuth Redirect

```
1. On /signin, click "Sign in with Google"
2. You should be taken to accounts.google.com
3. Should ask for permission
4. Click "Allow" or sign in if needed
```

**If you don't see Google login**:
- Try incognito/private mode
- Disable ad-blockers
- Check console for network errors

### Test 3: Return to App

```
1. After approving Google login
2. Should redirect back to http://localhost:3000/signin (with token in URL)
3. Button shows "Signing in..." for a moment
4. Should redirect to /venues
5. You should be logged in
```

**If it doesn't redirect**:
- Check console for errors
- Try with ?debug_google for more info
- Clear cache and try again

---

## 📋 Pre-Flight Checklist

Before reporting issues, make sure:

- [ ] `.env.local` has `NEXT_PUBLIC_GOOGLE_CLIENT_ID` set
- [ ] Dev server is running (`pnpm dev`)
- [ ] Using http://localhost:3000 or http://localhost:3001 (not IP address in production)
- [ ] Browser cache cleared (or private/incognito mode)
- [ ] Google account has verified email
- [ ] No ad-blockers blocking Google APIs
- [ ] Google Cloud Console has correct redirect URIs added

---

## 🧪 Testing with Debug Mode

Visit: `http://localhost:3000/signin?debug_google`

**Console Output Example**:
```
[Google Auth] Starting OAuth flow: {redirectUri: "http://localhost:3000/signin", clientId: "255687396..."}
[Google Auth] Callback received: {hasIdToken: true, hasNonce: true, hasState: false, error: null, errorDescription: null}
[Google Auth] Successfully decoded credentials: {email: "user@example.com", name: "User Name"}
[Google Auth] Login successful
```

---

## 📞 Further Help

### Check Files

- **GoogleLoginButton.tsx** - Frontend logic
- **AuthContext.tsx** - Auth state management
- **.env.local** - Configuration

### Google OAuth Docs

- https://developers.google.com/identity/protocols/oauth2
- https://support.google.com/cloud/answer/6158849

### Browser Console Errors

Press **F12** → **Console** tab to see:
- Network errors
- JavaScript errors
- OAuth flow logs (with ?debug_google)

---

## 🎯 Expected Behavior After Fix

### After Clicking "Sign in with Google"

1. **First time**: Redirects to Google login page
   - You sign in with Google account
   - Google asks for permission ("Sign in to Evora Events")
   - You click "Allow"

2. **Subsequent times**: Redirects immediately (if Google session active)
   - No manual login needed
   - Straight back to the app

### After Successful Login

- User object stored in localStorage
- Redirected to `/venues` page
- See all venues and services
- Can browse, book services

---

## 🆘 Emergency Reset

If everything is broken:

```bash
# 1. Clear all cache
rm -rf .next node_modules/.vite

# 2. Restart server
pnpm dev

# 3. Clear browser data
# DevTools → Application → Clear Site Data

# 4. Try fresh login
# Visit: http://localhost:3000/signin?debug_google
```

---

**Version**: 1.0.0 (Fixed & Enhanced)  
**Last Updated**: April 13, 2026
