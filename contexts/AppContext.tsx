'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  getCart,
  saveCart as saveCartToStorage,
  clearCart as clearCartFromStorage,
  getAllBookings,
  appendBooking,
  updateBooking as persistBookingUpdate,
  type Booking,
} from '@/lib/storage'

export interface CartItem {
  id: string
  type: 'venue' | 'service'
  name: string
  price: number
  quantity: number
  date: string
}

export interface SearchQuery {
  pax: number
  date: string
  location: string
  category: string
}

/** Stable unique key for a cart line (id alone can repeat across different dates). */
export function cartLineKey(item: Pick<CartItem, 'type' | 'id' | 'date'>) {
  return `${item.type}-${item.id}-${item.date}`
}

interface AppContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, date: string) => void
  clearCart: () => void
  searchQuery: SearchQuery | null
  setSearchQuery: (query: SearchQuery) => void
  bookings: Booking[]
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, updates: Partial<Booking>) => Booking | null
  isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart and bookings from localStorage on mount
  useEffect(() => {
    const savedCart = getCart()
    setCart(savedCart as CartItem[])
    setBookings(getAllBookings())
    setIsLoading(false)
  }, [])

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.date === item.date)
      let updated
      if (existing) {
        updated = prev.map(i => i.id === item.id && i.date === item.date ? { ...i, quantity: i.quantity + item.quantity } : i)
      } else {
        updated = [...prev, item]
      }
      saveCartToStorage(updated)
      return updated
    })
  }

  const removeFromCart = (id: string, date: string) => {
    setCart(prev => {
      const updated = prev.filter(item => !(item.id === id && item.date === date))
      saveCartToStorage(updated)
      return updated
    })
  }

  const clearCart = () => {
    setCart([])
    clearCartFromStorage()
  }

  const addBooking = (booking: Booking) => {
    appendBooking(booking)
    setBookings(prev => (prev.some(b => b.id === booking.id) ? prev : [...prev, booking]))
  }

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const updated = persistBookingUpdate(id, updates)
    if (updated) {
      setBookings(prev => prev.map(b => (b.id === id ? updated : b)))
    }
    return updated
  }

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        searchQuery,
        setSearchQuery,
        bookings,
        addBooking,
        updateBooking,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
