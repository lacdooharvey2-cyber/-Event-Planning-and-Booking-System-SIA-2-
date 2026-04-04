'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, Calendar, Clock, Download, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatReceiptPlainText } from '@/lib/receipt-email'
import { requestEmailReceipt } from '@/lib/request-email-receipt'

export default function BookingConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string
  const { bookings, updateBooking } = useApp()
  const { isLoggedIn, user } = useAuth()
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null)
  const [mailtoUrl, setMailtoUrl] = useState<string | null>(null)

  const booking = bookings.find(b => b.id === bookingId)
  const canView =
    !!booking && !!user && (user.role === 'admin' || booking.userId === user.id)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  if (!booking || !canView) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-muted-foreground mb-4">The booking you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/bookings">View All Bookings</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const statusMeta =
    booking.status === 'confirmed'
      ? { label: 'Confirmed', className: 'bg-green-600', icon: CheckCircle as typeof CheckCircle }
      : booking.status === 'pending'
        ? { label: 'Pending admin approval', className: 'bg-yellow-600', icon: Clock }
        : booking.status === 'completed'
          ? { label: 'Completed', className: 'bg-blue-600', icon: CheckCircle }
          : { label: 'Cancelled', className: 'bg-red-600', icon: Clock }

  const StatusIcon = statusMeta.icon

  const handleDownloadReceipt = () => {
    const text = formatReceiptPlainText(booking)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `evora-receipt-${booking.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSendReceiptEmail = async () => {
    setEmailFeedback(null)
    setMailtoUrl(null)
    const result = await requestEmailReceipt(booking.customerInfo.email, booking)
    if ('sent' in result && result.sent) {
      setEmailFeedback(`Receipt sent to ${booking.customerInfo.email}.`)
      return
    }
    if ('mailtoUrl' in result) {
      setEmailFeedback('Open your email app to send the receipt (or add RESEND_API_KEY for automatic delivery).')
      setMailtoUrl(result.mailtoUrl)
      return
    }
    setEmailFeedback('Could not prepare email. Try downloading the receipt instead.')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <StatusIcon
              className={`h-16 w-16 ${booking.status === 'pending' ? 'text-yellow-600' : booking.status === 'confirmed' || booking.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {booking.status === 'pending'
              ? 'Booking received — pending confirmation'
              : booking.status === 'confirmed'
                ? 'Booking confirmed'
                : booking.status === 'completed'
                  ? 'Booking completed'
                  : 'Booking cancelled'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {booking.status === 'pending'
              ? 'Payment is recorded. An admin will confirm your booking soon. A receipt has been sent or queued to your email.'
              : booking.status === 'confirmed'
                ? 'Your booking is confirmed. Thank you for choosing Evora Events.'
                : 'See details below for this booking.'}
          </p>
        </div>

        {user?.role === 'admin' && booking.status === 'pending' && (
          <Card className="p-4 mb-6 border-yellow-200 bg-yellow-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-yellow-900">This booking is waiting for admin confirmation.</p>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white shrink-0"
                onClick={() => updateBooking(booking.id, { status: 'confirmed' })}
              >
                Confirm booking
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Booking details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-mono text-lg">#{booking.id.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`${statusMeta.className} text-white mt-1`}>{statusMeta.label}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Booked on
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
              <h2 className="text-lg font-semibold mb-4">Payment summary</h2>
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">₱{booking.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <h2 className="text-lg font-semibold mb-4">Booked items</h2>
            <div className="space-y-3">
              {booking.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type === 'venue' ? 'Venue' : 'Service'}
                      {item.date ? ` • ${item.date}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₱{(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      ₱{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-8 mb-8 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold mb-4">What&apos;s next?</h2>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">1.</span>
              <span>Check your email for your payment receipt (or use the buttons below).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">2.</span>
              <span>
                {booking.status === 'pending'
                  ? 'Wait for an admin to confirm your booking. You will see the status change to Confirmed here.'
                  : 'Keep your receipt for your records.'}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">3.</span>
              <span>The venue or vendor may contact you before your event date.</span>
            </li>
          </ol>
        </Card>

        {emailFeedback && (
          <p className="text-sm text-center text-blue-900 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-4">
            {emailFeedback}
          </p>
        )}
        {mailtoUrl && (
          <div className="flex justify-center mb-6">
            <Button asChild className="bg-slate-800 hover:bg-slate-900 text-white">
              <a href={mailtoUrl}>Open email app with receipt</a>
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/bookings" className="flex items-center gap-2">
              View all bookings
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent" type="button" onClick={handleDownloadReceipt}>
            <Download className="h-4 w-4" />
            Download receipt
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent" type="button" onClick={handleSendReceiptEmail}>
            <Mail className="h-4 w-4" />
            Email receipt
          </Button>
          <Button asChild variant="outline">
            <Link href="/venues">Back</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
