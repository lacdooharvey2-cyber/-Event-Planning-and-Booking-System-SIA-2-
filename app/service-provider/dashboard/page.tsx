'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import {
  Calendar,
  DollarSign,
  Star,
  Users,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  TrendingUp,
  MessageSquare,
} from 'lucide-react'

export default function ServiceProviderDashboard() {
  const router = useRouter()
  const { user, isLoggedIn } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  if (!isLoggedIn || user?.role !== 'service_provider') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You must be logged in as a service provider to access this page.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/signin">Sign In</Link>
          </Button>
        </Card>
      </div>
    )
  }

  // Mock data
  const stats = [
    { label: 'Total Bookings', value: 24, icon: Calendar, trend: '+12%' },
    { label: 'Revenue This Month', value: '₱48,500', icon: DollarSign, trend: '+23%' },
    { label: 'Rating', value: 4.8, icon: Star, trend: '+0.3' },
    { label: 'Total Customers', value: 156, icon: Users, trend: '+8%' },
  ]

  const bookingsData = [
    { month: 'Jan', bookings: 4, revenue: 8000 },
    { month: 'Feb', bookings: 6, revenue: 12000 },
    { month: 'Mar', bookings: 5, revenue: 10500 },
    { month: 'Apr', bookings: 8, revenue: 16800 },
    { month: 'May', bookings: 10, revenue: 21000 },
    { month: 'Jun', bookings: 12, revenue: 25200 },
  ]

  const listings = [
    {
      id: 1,
      name: 'Professional Photography Package - 8 Hours',
      category: 'Photography',
      price: 15000,
      rating: 4.9,
      reviews: 24,
      bookings: 12,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Videography & Drone Coverage',
      category: 'Videography',
      price: 25000,
      rating: 4.7,
      reviews: 18,
      bookings: 8,
      status: 'Active',
    },
  ]

  const upcomingBookings = [
    {
      id: 'BK001',
      customerName: 'Maria Garcia',
      eventDate: '2026-03-15',
      service: 'Professional Photography',
      status: 'Confirmed',
      amount: '₱15,000',
    },
    {
      id: 'BK002',
      customerName: 'Juan Santos',
      eventDate: '2026-03-22',
      service: 'Videography & Drone',
      status: 'Pending',
      amount: '₱25,000',
    },
    {
      id: 'BK003',
      customerName: 'Ana Reyes',
      eventDate: '2026-03-28',
      service: 'Professional Photography',
      status: 'Confirmed',
      amount: '₱15,000',
    },
  ]

  const messages = [
    { id: 1, sender: 'Maria Garcia', subject: 'Inquiry about photographer', preview: 'Hi, I wanted to ask about...' },
    { id: 2, sender: 'John Smith', subject: 'Booking confirmation', preview: 'Thank you for confirming my booking...' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Service Provider Dashboard</h1>
              <p className="text-muted-foreground">Manage your services and bookings</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Profile</Button>
              <Button variant="outline" onClick={() => router.push('/')}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex gap-4">
            {['overview', 'listings', 'bookings', 'messages'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <Card key={idx} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-sm text-green-600 font-medium">{stat.trend} from last month</p>
                  </Card>
                )
              })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Bookings & Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bookingsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Upcoming Bookings */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Upcoming Bookings</h3>
                <Button variant="outline" size="sm" asChild>
                  <Link href="#">View All</Link>
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-semibold">Booking ID</th>
                      <th className="text-left py-3 font-semibold">Customer</th>
                      <th className="text-left py-3 font-semibold">Service</th>
                      <th className="text-left py-3 font-semibold">Event Date</th>
                      <th className="text-left py-3 font-semibold">Status</th>
                      <th className="text-left py-3 font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingBookings.map(booking => (
                      <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 font-mono text-blue-600">{booking.id}</td>
                        <td className="py-3">{booking.customerName}</td>
                        <td className="py-3">{booking.service}</td>
                        <td className="py-3">{booking.eventDate}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'Confirmed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 font-semibold">{booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Service Listings</h2>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Service
              </Button>
            </div>

            <div className="grid gap-4">
              {listings.map(listing => (
                <Card key={listing.id} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Service Name</p>
                      <p className="font-semibold">{listing.name}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{listing.rating}</span>
                        <span className="text-sm text-muted-foreground">({listing.reviews} reviews)</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-semibold text-lg text-blue-600">₱{listing.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">{listing.bookings} bookings</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {listing.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Manage Bookings</h2>

            <div className="grid gap-4">
              {upcomingBookings.map(booking => (
                <Card key={booking.id} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Booking ID</p>
                      <p className="font-mono font-semibold text-blue-600">{booking.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-semibold">{booking.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Event Date</p>
                      <p className="font-semibold">{booking.eventDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold text-lg">{booking.amount}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Messages</h2>

            <div className="space-y-4">
              {messages.map(message => (
                <Card key={message.id} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{message.sender}</p>
                      <p className="text-sm text-muted-foreground mt-1">{message.subject}</p>
                      <p className="text-sm text-muted-foreground mt-1">{message.preview}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
