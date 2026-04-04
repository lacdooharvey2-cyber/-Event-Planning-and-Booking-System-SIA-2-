'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cartLineKey, useApp } from '@/contexts/AppContext'
import { requestEmailReceipt } from '@/lib/request-email-receipt'
import { persistOrderRemote } from '@/lib/persist-order'
import type { Booking } from '@/lib/storage'
import { useAuth } from '@/contexts/AuthContext'
import { Trash2, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, clearCart, addBooking } = useApp()
  const { isLoggedIn, user } = useAuth()

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      router.push('/signin')
      return
    }

    // Simulate quick booking creation (legacy flow, no detailed payment)
    const newBookingId = Math.random().toString(36).substr(2, 9)
    const nowIso = new Date().toISOString()
    const eventDate = cart[0]?.date ?? nowIso.slice(0, 10)
    const guestCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    const booking: Booking = {
      id: newBookingId,
      userId: user!.id,
      items: cart.map(item => ({
        id: item.id,
        type: item.type,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        date: item.date,
      })),
      totalAmount: total,
      status: 'pending',
      eventDate,
      guestCount,
      location: 'N/A',
      customerInfo: {
        name: user!.name,
        email: user!.email,
        phone: user!.phone || '',
      },
      paymentInfo: {
        method: 'Cart Checkout',
        cardLast4: '0000',
        transactionId: newBookingId,
        paidAt: nowIso,
      },
      createdAt: nowIso,
      updatedAt: nowIso,
    }

    addBooking(booking)
    persistOrderRemote(booking)
    clearCart()
    void requestEmailReceipt(booking.customerInfo.email, booking)
    router.push(`/bookings/${booking.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/venues" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map(item => (
                  <Card key={cartLineKey(item)} className="p-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.type === 'venue' ? 'Venue' : 'Service'} • {item.date}
                      </p>
                      <p className="text-lg font-bold text-blue-600 mt-2">
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ₱{item.price.toLocaleString()} × {item.quantity} {item.type === 'venue' ? 'booking' : 'unit'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.date)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-4">Add venues and services to get started</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/venues">Browse Venues</Link>
                </Button>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₱{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span className="text-blue-600">₱{total.toLocaleString()}</span>
              </div>

              <Button onClick={() => router.push('/checkout')} className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-3" disabled={cart.length === 0}>
                {isLoggedIn ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </Button>

              {cart.length > 0 && (
                <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                  Clear Cart
                </Button>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-900">
                  📌 All bookings include a confirmation email with contract details and payment receipt.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
