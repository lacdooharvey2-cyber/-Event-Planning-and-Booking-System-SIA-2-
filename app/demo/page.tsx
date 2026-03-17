'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Copy, CheckCircle2, Users, BarChart3, CreditCard, BookOpen } from 'lucide-react'
import { useState } from 'react'

export default function DemoPage() {
  const [copiedEmail, setCopiedEmail] = useState('')

  const demoAccounts = [
    {
      role: 'Customer',
      email: 'customer@example.com',
      password: 'customer123',
      description: 'Browse venues, book services, view bookings',
      icon: Users,
    },
    {
      role: 'Venue Owner',
      email: 'venue@example.com',
      password: 'venue123',
      description: 'Manage venue listings and bookings',
      icon: BookOpen,
    },
    {
      role: 'Service Provider',
      email: 'provider@example.com',
      password: 'provider123',
      description: 'Manage services, pricing, and bookings',
      icon: BarChart3,
    },
    {
      role: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      description: 'Platform analytics and user management',
      icon: BarChart3,
    },
  ]

  const copyToClipboard = (text: string, email: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEmail(email)
    setTimeout(() => setCopiedEmail(''), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">EventHub Demo</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Try EventHub with demo accounts for each role. All data is stored locally for testing.
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {demoAccounts.map((account, idx) => {
            const Icon = account.icon
            return (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{account.role}</h3>
                    <p className="text-sm text-muted-foreground">{account.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono break-all">
                        {account.email}
                      </code>
                      <button
                        onClick={() => copyToClipboard(account.email, account.email)}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                      >
                        {copiedEmail === account.email ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Password</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                        {account.password}
                      </code>
                      <button
                        onClick={() => copyToClipboard(account.password, account.email)}
                        className="p-2 hover:bg-gray-200 rounded transition-colors"
                      >
                        {copiedEmail === account.email ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                    <Link href="/signin">Sign In as {account.role}</Link>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg border border-border p-8 mb-12">
          <h2 className="text-2xl font-bold mb-8">What You Can Do</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Browse & Search Venues</h4>
                  <p className="text-muted-foreground text-sm">
                    Find venues with advanced filters by category, location, and capacity.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Add Services</h4>
                  <p className="text-muted-foreground text-sm">
                    Browse photography, catering, decoration and entertainment services.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Complete Checkout</h4>
                  <p className="text-muted-foreground text-sm">
                    Use test card (4242 4242 4242 4242) for mock payment processing.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">View Bookings</h4>
                  <p className="text-muted-foreground text-sm">
                    Track all your bookings with confirmation numbers and payment details.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold">5</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Vendor Dashboard</h4>
                  <p className="text-muted-foreground text-sm">
                    Manage listings, view analytics, and handle customer requests.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold">6</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Admin Control Panel</h4>
                  <p className="text-muted-foreground text-sm">
                    Monitor platform activity, manage users, and review system analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Card Info */}
        <Card className="bg-amber-50 border-amber-200 p-6 mb-12">
          <div className="flex gap-4">
            <CreditCard className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Test Payment Card</h3>
              <p className="text-amber-800 text-sm mb-3">
                For demo purposes, use this test card number to complete checkout:
              </p>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded border border-amber-200 w-fit">
                <code className="font-mono font-bold text-amber-900">4242 4242 4242 4242</code>
                <button
                  onClick={() => copyToClipboard('4242424242424242', 'card')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {copiedEmail === 'card' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
              <ul className="text-sm text-amber-800 mt-3 space-y-1 list-disc list-inside">
                <li>Expiry: Any future date (e.g., 12/26)</li>
                <li>CVV: Any 3-4 digits (e.g., 123)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Quick Start */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
          <div className="space-y-4 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Step 1: Choose a Role</h4>
                <p className="text-muted-foreground text-sm">Pick a demo account from above based on what you want to test.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Step 2: Copy Credentials</h4>
                <p className="text-muted-foreground text-sm">Click the copy button next to email and password to copy them.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Step 3: Sign In</h4>
                <p className="text-muted-foreground text-sm">Paste the credentials on the sign-in page to log in.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 pt-0.5">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Step 4: Explore</h4>
                <p className="text-muted-foreground text-sm">Use the navigation menu to explore all features specific to your role.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
