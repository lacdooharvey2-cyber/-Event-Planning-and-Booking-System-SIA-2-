'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Building2, CreditCard, TrendingUp, AlertCircle, Database } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type AdminDbStats = {
  venuesCount: number
  servicesCount: number
  ordersCount: number
  pendingOrders: number
  revenueAllTime: number
  revenueThisMonth: number
  usersCount: number
}

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoggedIn } = useAuth()
  const { bookings, updateBooking } = useApp()
  const [dbStats, setDbStats] = useState<AdminDbStats | null>(null)
  const [dbAvailable, setDbAvailable] = useState(false)
  const pendingBookings = bookings.filter(b => b.status === 'pending')

  const systemStats = useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    const thisMonthBookings = bookings.filter(b => {
      const d = new Date(b.createdAt)
      return d.getMonth() === month && d.getFullYear() === year
    })
    const thisMonthRevenue = thisMonthBookings.reduce((sum, b) => sum + b.totalAmount, 0)
    const allRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0)
    const avgBooking = bookings.length ? allRevenue / bookings.length : 0
    return {
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      thisMonthBookings: thisMonthBookings.length,
      thisMonthRevenue,
      allRevenue,
      avgBooking,
    }
  }, [bookings])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/stats')
        const data = await res.json()
        if (cancelled || !res.ok || !data?.ok) return
        setDbStats(data.stats as AdminDbStats)
        setDbAvailable(true)
      } catch {
        if (!cancelled) {
          setDbAvailable(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const usersListCount = useMemo(() => {
    if (typeof window === 'undefined') return 0
    const rawA = localStorage.getItem('eventhub_users')
    const rawB = localStorage.getItem('eventhub_users_list')
    const arrA = rawA ? (JSON.parse(rawA) as Array<{ id: string; role?: string }>) : []
    const arrB = rawB ? (JSON.parse(rawB) as Array<{ id: string; role?: string }>) : []
    return [...arrA, ...arrB].length
  }, [])

  const totalUsers = dbStats?.usersCount || usersListCount
  const totalVenues = dbStats?.venuesCount ?? 0
  const totalServices = dbStats?.servicesCount ?? 0
  const totalBookings = Math.max(systemStats.totalBookings, dbStats?.ordersCount ?? 0)
  const totalRevenue = Math.max(systemStats.allRevenue, dbStats?.revenueAllTime ?? 0)
  const monthRevenue = Math.max(systemStats.thisMonthRevenue, dbStats?.revenueThisMonth ?? 0)
  const monthBookings = Math.max(systemStats.thisMonthBookings, 0)
  const pendingTotal = Math.max(systemStats.pendingBookings, dbStats?.pendingOrders ?? 0)

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      router.push('/')
    }
  }, [isLoggedIn, user, router])

  if (!isLoggedIn || user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Live metrics from system data {dbAvailable ? 'and MySQL database' : '(DB unavailable, using system fallback)'}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Badge className={dbAvailable ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}>
              <Database className="h-3 w-3 mr-1" />
              {dbAvailable ? 'Database connected' : 'Database not connected'}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">From users table / system registry</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Venues</h3>
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{totalVenues.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">Loaded from `venues` table</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Bookings</h3>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Pending: <span className="font-semibold text-yellow-700">{pendingTotal}</span>
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">₱{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-2">All-time collected amount</p>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Users Management */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="text-sm">Total Customers</span>
                <span className="font-semibold">
                  {bookings.reduce((set, b) => set.add(b.userId), new Set<string>()).size}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="text-sm">Venue Owners</span>
                <span className="font-semibold">N/A</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="text-sm">Admins</span>
                <span className="font-semibold">{user?.role === 'admin' ? 1 : 0}</span>
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </Card>

          {/* Venues Management */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Venues Management</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="text-sm">Active Venues</span>
                <span className="font-semibold">{totalVenues}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="text-sm">Pending Approval</span>
                <Badge className="bg-yellow-600 text-white">0</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="text-sm">Reported Issues</span>
                <Badge className="bg-red-600 text-white">0</Badge>
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/admin/venues">Manage Venues</Link>
            </Button>
          </Card>

          {/* Services Management */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Services Management</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="text-sm">Total Services</span>
                <span className="font-semibold">{totalServices.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="text-sm">Service Providers</span>
                <span className="font-semibold">
                  {new Set(bookings.flatMap(b => b.items.filter(i => i.type === 'service').map(i => i.id))).size}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="text-sm">Inactive Services</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/admin/services">Manage Services</Link>
            </Button>
          </Card>

          {/* Reports & Analytics */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Reports & Analytics</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="text-sm">This Month's Bookings</span>
                <span className="font-semibold">{monthBookings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="text-sm">This Month's Revenue</span>
                <span className="font-semibold">₱{monthRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="text-sm">Avg. Booking Value</span>
                <span className="font-semibold">₱{Math.round(systemStats.avgBooking).toLocaleString()}</span>
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/admin/reports">View Reports</Link>
            </Button>
          </Card>
        </div>

        {/* Pending booking confirmations */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="text-xl font-semibold">Bookings awaiting confirmation</h2>
              <p className="text-sm text-muted-foreground mt-1">
                New checkouts stay pending until you confirm them. Customers receive a receipt by email; status becomes
                confirmed only after you approve.
              </p>
            </div>
            <Badge className="bg-yellow-600 text-white shrink-0">{pendingBookings.length} pending</Badge>
          </div>
          {pendingBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No bookings waiting for admin confirmation.</p>
          ) : (
            <ul className="space-y-3">
              {pendingBookings.map(b => (
                <li
                  key={b.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg bg-muted/30"
                >
                  <div className="space-y-1">
                    <p className="font-mono text-sm font-semibold">#{b.id}</p>
                    <p className="text-sm">
                      {b.customerInfo.name} · {b.customerInfo.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Event {b.eventDate} · ₱{b.totalAmount.toLocaleString()} · {b.guestCount} guests
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/bookings/${b.id}`}>View</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => updateBooking(b.id, { status: 'confirmed' })}
                    >
                      Confirm booking
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

      </div>
    </div>
  )
}
