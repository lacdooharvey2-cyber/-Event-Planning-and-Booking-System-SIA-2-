'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const GOOGLE_CLIENT_ID = '255687396164-l1nrorhkguiartgu58sa059umd462brn.apps.googleusercontent.com'

function decodeGoogleCredential(token: string): { email?: string; name?: string } {
  try {
    const payload = token.split('.')[1]
    if (!payload) return {}
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    const decoded = JSON.parse(atob(padded))
    return {
      email: typeof decoded.email === 'string' ? decoded.email : undefined,
      name: typeof decoded.name === 'string' ? decoded.name : undefined,
    }
  } catch {
    return {}
  }
}

export function GoogleLoginButton() {
  const router = useRouter()
  const { loginWithGoogle } = useAuth()
  const loginWithGoogleRef = useRef(loginWithGoogle)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loginWithGoogleRef.current = loginWithGoogle
  }, [loginWithGoogle])

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash.includes('id_token=')) return

    const params = new URLSearchParams(hash)
    const idToken = params.get('id_token')
    const nonce = params.get('nonce')
    const expectedNonce = sessionStorage.getItem('google_auth_nonce')
    sessionStorage.removeItem('google_auth_nonce')
    if (!idToken) return
    if (!nonce || !expectedNonce || nonce !== expectedNonce) {
      setError('Google login security check failed. Please try again.')
      history.replaceState(null, '', window.location.pathname + window.location.search)
      return
    }

    const { email, name } = decodeGoogleCredential(idToken)
    if (!email) {
      setError('Google login redirect failed. Please try again.')
      history.replaceState(null, '', window.location.pathname + window.location.search)
      return
    }

    setLoading(true)
    void loginWithGoogleRef.current(email, name)
      .then(() => {
        history.replaceState(null, '', window.location.pathname + window.location.search)
        router.replace('/venues')
        window.location.assign('/venues')
      })
      .catch(() => {
        setError('Google login failed after redirect. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [router])

  const startRedirectGoogle = () => {
    const redirectUri = window.location.origin + window.location.pathname
    const nonce = crypto.randomUUID()
    sessionStorage.setItem('google_auth_nonce', nonce)
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
          className="h-11 px-5 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium inline-flex items-center gap-2"
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.3 14.7 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12S6.6 21.8 12 21.8c6.9 0 9.6-4.8 9.6-7.3 0-.5-.1-.9-.1-1.3H12z"/>
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
      {loading ? <p className="text-xs text-muted-foreground text-center">Signing in with Google...</p> : null}
      {error ? <p className="text-xs text-red-600 text-center">{error}</p> : null}
    </div>
  )
}
