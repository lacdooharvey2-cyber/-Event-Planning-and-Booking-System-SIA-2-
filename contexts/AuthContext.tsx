'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'customer' | 'venue_owner' | 'service_provider' | 'admin' | null

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  address?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: (email: string, name?: string) => Promise<void>
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('eventhub_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('eventhub_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const normalizedEmail = email.trim().toLowerCase()

    // Fixed accounts per role (use these to log in; no signup needed). Keys must be lowercase.
    const accounts: Record<string, { password: string; id: string; name: string; role: UserRole }> = {
      'client@evora.com': { password: 'client123', id: 'user-client', name: 'Client User', role: 'customer' },
      'venue@evora.com': { password: 'venue123', id: 'user-venue', name: 'Venue Manager', role: 'venue_owner' },
      'provider@evora.com': { password: 'provider123', id: 'user-provider', name: 'Service Provider', role: 'service_provider' },
      'admin@evora.com': { password: 'admin123', id: 'user-admin', name: 'Admin', role: 'admin' },
      'lacdooharvey2@gmail.com': {
        password: 'LacdooHarvey-Evora2026!',
        id: 'user-admin-lacdooharvey',
        name: 'Harvey Lacdoo',
        role: 'admin',
      },
    }

    const account = accounts[normalizedEmail]
    if (!account || account.password !== password) {
      setIsLoading(false)
      throw new Error('Invalid email or password')
    }

    const userData: User = {
      id: account.id,
      email: normalizedEmail,
      name: account.name,
      role: account.role,
      phone: '09123456789',
    }

    setUser(userData)
    localStorage.setItem('eventhub_user', JSON.stringify(userData))
    setIsLoading(false)
  }

  const loginWithGoogle = async (email: string, name?: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    const normalizedEmail = email.trim().toLowerCase()
    const stored = localStorage.getItem('eventhub_users_list')
    const existingUsers = stored ? JSON.parse(stored) : []
    const existing = existingUsers.find((u: any) => String(u.email).toLowerCase() === normalizedEmail)

    const role: UserRole = normalizedEmail === 'lacdooharvey2@gmail.com' ? 'admin' : existing?.role ?? 'customer'
    const userData: User = {
      id: existing?.id ?? (normalizedEmail === 'lacdooharvey2@gmail.com' ? 'user-admin-lacdooharvey' : Math.random().toString(36).substr(2, 9)),
      email: normalizedEmail,
      name: existing?.name || name || normalizedEmail.split('@')[0],
      role,
      phone: existing?.phone || '',
    }

    if (!existing) {
      existingUsers.push(userData)
      localStorage.setItem('eventhub_users_list', JSON.stringify(existingUsers))
    }

    setUser(userData)
    localStorage.setItem('eventhub_user', JSON.stringify(userData))
    setIsLoading(false)
  }

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check if email already exists
    const stored = localStorage.getItem('eventhub_users_list')
    const existingUsers = stored ? JSON.parse(stored) : []
    if (existingUsers.some((u: any) => u.email === email)) {
      setIsLoading(false)
      throw new Error('Email already registered')
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: role || 'customer',
      phone: '',
    }

    // Save new user to list
    existingUsers.push(newUser)
    localStorage.setItem('eventhub_users_list', JSON.stringify(existingUsers))

    setUser(newUser)
    localStorage.setItem('eventhub_user', JSON.stringify(newUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('eventhub_user')
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data }
      setUser(updated)
      localStorage.setItem('eventhub_user', JSON.stringify(updated))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn: !!user, login, loginWithGoogle, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
