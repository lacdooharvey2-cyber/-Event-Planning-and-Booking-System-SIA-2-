'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, FileText, Download } from 'lucide-react'
import { useEffect } from 'react'

export default function BookingsPage() {
  const router = useRouter()
  const { isLoggedIn, user } = useAuth()
  const { bookings } = useApp()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your event bookings</p>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map(booking => (
              <Card key={booking.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold">Booking #{booking.id.slice(0, 8).toUpperCase()}</h3>
                      <Badge className={`${booking.status === 'confirmed' ? 'bg-green-600' : booking.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'} text-white`}>
                        {booking.status === 'confirmed' ? 'Confirmed' : booking.status === 'pending' ? 'Pending' : 'Cancelled'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-semibold text-foreground mt-3">
                        Total: ₱{booking.totalAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold text-sm mb-2">Items:</h4>
                      <div className="space-y-1">
                        {booking.items.map((item: any, idx: number) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            • {item.name} - ₱{(item.price * item.quantity).toLocaleString()} ({item.quantity}x)
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:w-auto">
                    <Button asChild variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Link href={`/bookings/${booking.id}`}>
                        <FileText className="h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Download Invoice
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-4">Start booking venues and services to see your bookings here</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/venues">Browse Venues</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
