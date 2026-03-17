'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Calendar, DollarSign, Eye, MessageSquare, Star } from 'lucide-react'
import { useEffect } from 'react'

export default function VendorDashboardPage() {
  const router = useRouter()
  const { user, isLoggedIn } = useAuth()

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'venue_owner') {
      router.push('/')
    }
  }, [isLoggedIn, user, router])

  if (!isLoggedIn || user?.role !== 'venue_owner') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your venues and bookings</p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">This Month Revenue</h3>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold">₱685K</div>
            <p className="text-xs text-green-600 mt-2">+15% from last month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Bookings</h3>
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">84</div>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Profile Views</h3>
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">2,340</div>
            <p className="text-xs text-green-600 mt-2">+28% from last month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Avg. Rating</h3>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground mt-2">Based on 124 reviews</p>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* My Venues */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">My Venues</h2>
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/vendor/venues/new">Add New Venue</Link>
                </Button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Secret Garden Pavilion', status: 'active', bookings: 34, rating: 4.8 },
                  { name: 'Glass Garden Hall', status: 'active', bookings: 28, rating: 4.9 },
                  { name: 'Fine Dining Rooftop', status: 'active', bookings: 22, rating: 5.0 },
                ].map((venue, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition">
                    <div>
                      <p className="font-medium">{venue.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{venue.bookings} bookings</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {venue.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600">Active</Badge>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/vendor/venues/${idx}`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Messages */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </h2>
              <Badge className="bg-red-600 text-white">3</Badge>
            </div>

            <div className="space-y-3">
              {[
                { from: 'John Doe', message: 'Inquiry about June 15 availability' },
                { from: 'Jane Smith', message: 'Question about catering options' },
                { from: 'Mike Johnson', message: 'Booking confirmation request' },
              ].map((msg, idx) => (
                <div key={idx} className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition cursor-pointer">
                  <p className="font-medium text-sm">{msg.from}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/vendor/messages">View All Messages</Link>
            </Button>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-2 font-semibold">Booking ID</th>
                  <th className="text-left py-3 px-2 font-semibold">Guest</th>
                  <th className="text-left py-3 px-2 font-semibold">Event Date</th>
                  <th className="text-left py-3 px-2 font-semibold">Venue</th>
                  <th className="text-left py-3 px-2 font-semibold">Status</th>
                  <th className="text-left py-3 px-2 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'BK001', guest: 'John Doe', date: '2026-02-20', venue: 'Garden Pavilion', status: 'confirmed', amount: '₱45K' },
                  { id: 'BK002', guest: 'Jane Smith', date: '2026-02-25', venue: 'Glass Garden', status: 'pending', amount: '₱60K' },
                  { id: 'BK003', guest: 'Mike Johnson', date: '2026-03-05', venue: 'Rooftop', status: 'confirmed', amount: '₱85K' },
                ].map((booking, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-2 font-mono text-blue-600">{booking.id}</td>
                    <td className="py-3 px-2">{booking.guest}</td>
                    <td className="py-3 px-2">{booking.date}</td>
                    <td className="py-3 px-2">{booking.venue}</td>
                    <td className="py-3 px-2">
                      <Badge className={booking.status === 'confirmed' ? 'bg-green-600' : 'bg-yellow-600'}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 font-semibold">{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
