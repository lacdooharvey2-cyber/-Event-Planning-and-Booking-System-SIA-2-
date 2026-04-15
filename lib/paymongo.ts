// Frontend PayMongo integration utilities

const PAYMONGO_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY

if (!PAYMONGO_PUBLIC_KEY) {
  throw new Error('NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY is not set')
}

// Function to create payment intent
export async function createPaymentIntent(amount: number): Promise<string> {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create payment intent')
  }

  const data = await response.json()
  return data.client_secret
}

// Function to confirm payment and update order
export async function confirmPayment(orderId: string): Promise<void> {
  const response = await fetch('/api/confirm-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to confirm payment')
  }
}

// Example usage in a React component
/*
import { useState } from 'react'
import { createPaymentIntent, confirmPayment } from '@/lib/paymongo'

export default function CheckoutButton({ orderId, totalAmount }: { orderId: string; totalAmount: number }) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      // Step 1: Create payment intent
      const clientSecret = await createPaymentIntent(totalAmount)

      // Step 2: Load PayMongo script if not loaded
      if (!window.Paymongo) {
        await loadPaymongoScript()
      }

      // Step 3: Create payment method and confirm
      const paymongo = new window.Paymongo(PAYMONGO_PUBLIC_KEY)
      const paymentIntent = await paymongo.createPaymentIntent(clientSecret)

      // Attach payment method (card details from user input)
      // This is a simplified example; in real app, collect card details securely
      const paymentMethod = await paymongo.createPaymentMethod({
        type: 'card',
        details: {
          card_number: '4111111111111111', // Test card
          exp_month: 12,
          exp_year: 2025,
          cvc: '123',
        },
      })

      await paymentIntent.attachPaymentMethod(paymentMethod.id)

      // Confirm payment
      const result = await paymentIntent.confirm()

      if (result.status === 'succeeded') {
        // Step 4: Update order status
        await confirmPayment(orderId)
        alert('Payment successful!')
      } else {
        alert('Payment failed')
      }
    } catch (error) {
      console.error(error)
      alert('Payment error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  )
}

function loadPaymongoScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Paymongo) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.paymongo.com/v1/paymongo.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load PayMongo script'))
    document.head.appendChild(script)
  })
}
*/