'use client'

import React from "react"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Lock, CheckCircle2, Smartphone, CreditCard } from 'lucide-react'
import { useState } from 'react'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart, addBooking } = useApp()
  const { isLoggedIn, user } = useAuth()
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gcash' | 'paymaya'>('card')
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    gcashNumber: '',
    paymayaNumber: '',
  })
  const [bookingId, setBookingId] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to complete your checkout.</p>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-3">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/signup">Create Account</Link>
          </Button>
        </Card>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Please add items to your cart before checking out.</p>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/venues">Browse Venues</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.fullName && formData.email && formData.phone) {
      setStep('payment')
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreeTerms) {
      alert('Please agree to the Terms and Conditions and Privacy Policy to proceed.')
      return
    }

    let isValid = false

    if (paymentMethod === 'card') {
      isValid = Boolean(
        paymentData.cardNumber &&
        paymentData.cardName &&
        paymentData.expiryDate &&
        paymentData.cvv
      )
    } else if (paymentMethod === 'gcash') {
      isValid = !!paymentData.gcashNumber && paymentData.gcashNumber.length >= 11
    } else if (paymentMethod === 'paymaya') {
      isValid = !!paymentData.paymayaNumber && paymentData.paymayaNumber.length >= 11
    }

    if (isValid) {
      setIsProcessing(true)

      // Simulate payment processing
      setTimeout(() => {
        const newBookingId = Math.random().toString(36).substring(2, 11)
        setBookingId(newBookingId)
        const [paidTotal, setPaidTotal] = useState(0);

        const methodLabel =
          paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'gcash' ? 'GCash' : 'PayMaya'

        const nowIso = new Date().toISOString()
        const eventDate = cart[0]?.date ?? nowIso.slice(0, 10)
        const guestCount = cart.reduce((sum, item) => sum + item.quantity, 0)

        const booking = {
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
          status: 'confirmed' as const,
          eventDate,
          guestCount,
          location: formData.address || 'N/A',
          customerInfo: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
          paymentInfo: {
            method: methodLabel,
            cardLast4: paymentMethod === 'card' ? paymentData.cardNumber.slice(-4) || '0000' : 'N/A',
            transactionId: newBookingId,
            paidAt: nowIso,
          },
          createdAt: nowIso,
          updatedAt: nowIso,
        }

        addBooking(booking)
        setPaidTotal(total)
        clearCart()
        setIsProcessing(false)
        setStep('success')
      }, 2000)
    } else {
      alert('Please complete all required payment details before proceeding.')
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/cart" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Customer Information */}
            {step === 'info' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Delivery & Contact Information</h2>
                <form onSubmit={handleInfoSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Event Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Where will the event be held?"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Continue to Payment
                  </Button>
                </form>
              </Card>
            )}

            {/* Step 2: Payment */}
            {step === 'payment' && (
              <Card className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">✓</div>
                    <div>
                      <p className="font-semibold">Customer Information</p>
                      <p className="text-sm text-muted-foreground">{formData.fullName} • {formData.email}</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                  <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900">Secure Payment</p>
                    <p className="text-sm text-blue-800">Your payment information is encrypted and secure.</p>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  {/* Card Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6" />
                      <div className="text-left">
                        <p className="font-semibold">Card</p>
                        <p className="text-xs text-muted-foreground">Credit/Debit Card</p>
                      </div>
                    </div>
                  </button>

                  {/* GCash Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gcash')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'gcash'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-6 w-6" />
                      <div className="text-left">
                        <p className="font-semibold">GCash</p>
                        <p className="text-xs text-muted-foreground">Mobile Wallet</p>
                      </div>
                    </div>
                  </button>

                  {/* PayMaya Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paymaya')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'paymaya'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-6 w-6" />
                      <div className="text-left">
                        <p className="font-semibold">PayMaya</p>
                        <p className="text-xs text-muted-foreground">Digital Wallet</p>
                      </div>
                    </div>
                  </button>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {/* Card Payment Fields */}
                  {paymentMethod === 'card' && (
                    <>
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={paymentData.cardName}
                          onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="4242 4242 4242 4242"
                          value={paymentData.cardNumber}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              cardNumber: e.target.value.replace(/\s/g, ''),
                            })
                          }
                          maxLength={16}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentData.expiryDate}
                            onChange={(e) =>
                              setPaymentData({
                                ...paymentData,
                                expiryDate: e.target.value,
                              })
                            }
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentData.cvv}
                            onChange={(e) =>
                              setPaymentData({
                                ...paymentData,
                                cvv: e.target.value,
                              })
                            }
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
                        For demo purposes, use test card: <span className="font-mono font-bold">4242 4242 4242 4242</span>
                      </div>
                    </>
                  )}

                  {/* GCash Payment Fields */}
                  {paymentMethod === 'gcash' && (
                    <>
                      <div>
                        <Label htmlFor="gcashNumber">GCash Mobile Number</Label>
                        <Input
                          id="gcashNumber"
                          placeholder="09XXXXXXXXX"
                          value={paymentData.gcashNumber}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              gcashNumber: e.target.value,
                            })
                          }
                          maxLength={11}
                          required
                        />
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
                        <p className="font-semibold mb-2">GCash Payment Instructions:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>You will receive a prompt on your GCash app</li>
                          <li>Approve the payment in your GCash app</li>
                          <li>Payment will be processed instantly</li>
                        </ol>
                      </div>
                    </>
                  )}

                  {/* PayMaya Payment Fields */}
                  {paymentMethod === 'paymaya' && (
                    <>
                      <div>
                        <Label htmlFor="paymayaNumber">PayMaya Mobile Number</Label>
                        <Input
                          id="paymayaNumber"
                          placeholder="09XXXXXXXXX"
                          value={paymentData.paymayaNumber}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              paymayaNumber: e.target.value,
                            })
                          }
                          maxLength={11}
                          required
                        />
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
                        <p className="font-semibold mb-2">PayMaya Payment Instructions:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>You will receive a PayMaya payment link</li>
                          <li>Click the link and authenticate in PayMaya app</li>
                          <li>Confirm the payment amount</li>
                        </ol>
                      </div>
                    </>
                  )}

                  {/* Terms and Conditions */}
                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:underline font-semibold">
                          Terms and Conditions
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline font-semibold">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep('info')}>
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled={isProcessing || !agreeTerms}>
                      {isProcessing ? 'Processing Payment...' : 'Pay Now'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">₱{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₱{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-blue-600">
                <span>Total</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
