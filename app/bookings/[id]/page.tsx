'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, Calendar, DollarSign, FileText, Download, Mail } from 'lucide-react'
import { useEffect } from 'react'

export default function BookingConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string
  const { bookings } = useApp()
  const { isLoggedIn } = useAuth()

  const booking = bookings.find(b => b.id === bookingId)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-muted-foreground mb-4">The booking you're looking for doesn't exist.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/bookings">View All Bookings</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-muted-foreground">Thank you for your booking. A confirmation email has been sent to your email address.</p>
        </div>

        {/* Booking Details */}
        <Card className="p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-mono text-lg">#{booking.id.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="bg-green-600 text-white mt-1">Confirmed</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Booking Date
                  </p>
                  <p className="font-medium">
                    {new Date(booking.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">₱{booking.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booked Items */}
          <div className="pt-8 border-t border-border">
            <h2 className="text-lg font-semibold mb-4">Booked Items</h2>
            <div className="space-y-3">
              {booking.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.type === 'venue' ? 'Venue' : 'Service'} • {item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₱{(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">₱{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-8 mb-8 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold mb-4">What's Next?</h2>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">1.</span>
              <span>Check your email for booking confirmation and contract details</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">2.</span>
              <span>Review the payment receipt and save it for your records</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">3.</span>
              <span>The venue will contact you 7 days before your event</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">4.</span>
              <span>Complete final arrangements and enjoy your event!</span>
            </li>
          </ol>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/bookings" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              View All Bookings
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download Invoice
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Mail className="h-4 w-4" />
            Send Receipt to Email
          </Button>
          <Button asChild variant="outline">
            <Link href="/venues">Back</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
