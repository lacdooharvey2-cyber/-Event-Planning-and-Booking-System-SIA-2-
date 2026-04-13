'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '255687396164-l1nrorhkguiartgu58sa059umd462brn.apps.googleusercontent.com'

function decodeGoogleCredential(token: string): { email?: string; name?: string; error?: string } {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return { error: 'Invalid token format' }
    }

    const payload = parts[1]
    if (!payload) {
      return { error: 'Missing token payload' }
    }

    // Base64 URL decode
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)

    try {
      const decoded = JSON.parse(atob(padded))

      if (!decoded.email) {
        return { error: 'Email not found in token. Make sure your Google account has an email.' }
      }

      return {
        email: typeof decoded.email === 'string' ? decoded.email : undefined,
        name: typeof decoded.name === 'string' ? decoded.name : undefined,
      }
    } catch (parseError) {
      return { error: `Failed to parse token payload: ${parseError instanceof Error ? parseError.message : 'Unknown error'}` }
    }
  } catch (error) {
    return { error: `Token decode error: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
}

export function GoogleLoginButton() {
  const router = useRouter()
  const { loginWithGoogle } = useAuth()
  const loginWithGoogleRef = useRef(loginWithGoogle)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [debugMode] = useState(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug_google'))

  useEffect(() => {
    loginWithGoogleRef.current = loginWithGoogle
  }, [loginWithGoogle])

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash.includes('id_token=')) return

    const params = new URLSearchParams(hash)
    const idToken = params.get('id_token')
    const nonce = params.get('nonce')
    const state = params.get('state')
    const error = params.get('error')
    const errorDescription = params.get('error_description')

    // Log for debugging
    if (debugMode) {
      console.log('[Google Auth] Callback received:', { hasIdToken: !!idToken, hasNonce: !!nonce, hasState: !!state, error, errorDescription })
    }

    // Check for Google OAuth errors
    if (error) {
      setError(`Google OAuth error: ${error}${errorDescription ? ' - ' + errorDescription : ''}`)
      history.replaceState(null, '', window.location.pathname + window.location.search)
      return
    }

    const expectedNonce = sessionStorage.getItem('google_auth_nonce')
    sessionStorage.removeItem('google_auth_nonce')

    if (!idToken) {
      setError('No ID token received from Google. Please try again.')
      history.replaceState(null, '', window.location.pathname + window.location.search)
      return
    }

    if (!nonce || !expectedNonce || nonce !== expectedNonce) {
      if (debugMode) {
        console.error('[Google Auth] Nonce mismatch:', { received: nonce, expected: expectedNonce })
      }
      setError('Security verification failed. Please clear your browser cache and try again.')
      history.replaceState(null, '', window.location.pathname + window.location.search)
      return
    }

    const decoded = decodeGoogleCredential(idToken)

    if (decoded.error) {
      setError(`Token decode failed: ${decoded.error}`)
      history.replaceState(null, '', window.location.pathname + window.location.search)
      return
    }

    const { email, name } = decoded

    if (!email) {
      setError('No email found in credentials. Please ensure your Google account has a verified email.')
      history.replaceState(null, '', window.location.pathname + window.location.search)
      return
    }

    if (debugMode) {
      console.log('[Google Auth] Successfully decoded credentials:', { email, name })
    }

    setLoading(true)
    void loginWithGoogleRef.current(email, name)
      .then(() => {
        if (debugMode) console.log('[Google Auth] Login successful')
        history.replaceState(null, '', window.location.pathname + window.location.search)
        router.replace('/venues')
      })
      .catch((err) => {
        console.error('[Google Auth] Login failed:', err)
        setError(`Login failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
      })
      .finally(() => setLoading(false))
  }, [router, debugMode])

  const startRedirectGoogle = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.')
      return
    }

    const redirectUri = window.location.origin + '/signin'
    const nonce = crypto.randomUUID()
    sessionStorage.setItem('google_auth_nonce', nonce)

    if (debugMode) {
      console.log('[Google Auth] Starting OAuth flow:', { redirectUri, clientId: GOOGLE_CLIENT_ID.slice(0, 10) + '...' })
    }

    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    url.searchParams.set('client_id', GOOGLE_CLIENT_ID)
    url.searchParams.set('redirect_uri', redirectUri)
    url.searchParams.set('response_type', 'id_token')
    url.searchParams.set('scope', 'openid email profile')
    url.searchParams.set('nonce', nonce)
    url.searchParams.set('prompt', 'select_account')

    window.location.assign(url.toString())
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={startRedirectGoogle}
          className="h-11 px-5 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium inline-flex items-center gap-2 transition-colors"
          disabled={loading}
          title={!GOOGLE_CLIENT_ID ? 'Google Client ID not configured' : ''}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.3 14.7 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12S6.6 21.8 12 21.8c6.9 0 9.6-4.8 9.6-7.3 0-.5-.1-.9-.1-1.3H12z" />
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
      {loading && <p className="text-xs text-muted-foreground text-center">Signing in with Google...</p>}
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
      {debugMode && (
        <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded">
          <p>🐛 Debug Mode Enabled</p>
          <p>Client ID: {GOOGLE_CLIENT_ID.slice(0, 20)}...</p>
        </div>
      )}
    </div>
  )
}
