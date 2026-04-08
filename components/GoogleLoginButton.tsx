'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string
            callback: (response: { credential?: string }) => void
          }) => void
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon'
              theme?: 'outline' | 'filled_blue' | 'filled_black'
              size?: 'large' | 'medium' | 'small'
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
              shape?: 'rectangular' | 'pill' | 'circle' | 'square'
              logo_alignment?: 'left' | 'center'
              width?: number
            }
          ) => void
        }
      }
    }
  }
}

const GOOGLE_CLIENT_ID = '255687396164-l1nrorhkguiartgu58sa059umd462brn.apps.googleusercontent.com'

function decodeGoogleCredential(token: string): { email?: string; name?: string } {
  try {
    const payload = token.split('.')[1]
    if (!payload) return {}
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(atob(normalized))
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
  const btnRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const renderGoogle = () => {
      if (!mounted || !btnRef.current || !window.google?.accounts?.id) return
      btnRef.current.innerHTML = ''
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          setError('')
          const credential = response.credential
          if (!credential) {
            setError('Google login failed. Please try again.')
            return
          }
          const { email, name } = decodeGoogleCredential(credential)
          if (!email) {
            setError('Google account email is missing.')
            return
          }
          try {
            await loginWithGoogle(email, name)
            router.push('/venues')
          } catch {
            setError('Google login failed. Please try again.')
          }
        },
      })
      window.google.accounts.id.renderButton(btnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 320,
      })
    }

    const existing = document.querySelector('script[data-google-gsi="true"]') as HTMLScriptElement | null
    if (existing) {
      if (window.google?.accounts?.id) renderGoogle()
      else existing.addEventListener('load', renderGoogle, { once: true })
    } else {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.dataset.googleGsi = 'true'
      script.onload = renderGoogle
      document.head.appendChild(script)
    }

    return () => {
      mounted = false
    }
  }, [loginWithGoogle])

  return (
    <div className="space-y-2">
      <div ref={btnRef} className="flex justify-center" />
      {error ? <p className="text-xs text-red-600 text-center">{error}</p> : null}
    </div>
  )
}
