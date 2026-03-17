'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import {
  Users,
  Building2,
  Briefcase,
  Shield,
  ArrowRight,
  CheckCircle2,
  Star,
  TrendingUp,
  Lock,
  Zap,
} from 'lucide-react'

export default function HowItWorks() {
  const { isLoggedIn } = useAuth()

  const roles = [
    {
      title: 'Customer',
      icon: Users,
      description: 'Book perfect venues and services for your events',
      benefits: [
        'Browse hundreds of verified venues',
        'Compare services and pricing',
        'Secure booking and payment',
        'Manage all bookings in one place',
        'Direct communication with vendors',
      ],
      color: 'blue',
      cta: isLoggedIn ? 'Browse Venues' : 'Sign Up as Customer',
      link: isLoggedIn ? '/venues' : '/signup',
    },
    {
      title: 'Venue Owner',
      icon: Building2,
      description: 'List your venue and manage bookings',
      benefits: [
        'Reach thousands of event planners',
        'Manage bookings and availability',
        'Track revenue and analytics',
        'Receive customer inquiries',
        'Build your reputation with reviews',
      ],
      color: 'green',
      cta: 'Become a Venue Owner',
      link: '/signup',
    },
    {
      title: 'Service Provider',
      icon: Briefcase,
      description: 'Offer your event services to customers',
      benefits: [
        'Create service listings',
        'Get bookings from customers',
        'Manage your schedule and bookings',
        'Track earnings and revenue',
        'Build your professional portfolio',
      ],
      color: 'purple',
      cta: 'Register as Service Provider',
      link: '/service-provider/register',
    },
    {
      title: 'Admin',
      icon: Shield,
      description: 'Manage the Evora events platform',
      benefits: [
        'System-wide analytics and reporting',
        'Manage users and vendors',
        'Handle disputes and issues',
        'Approve new listings',
        'Monitor platform performance',
      ],
      color: 'orange',
      cta: 'Admin Access Only',
      link: '#',
      disabled: true,
    },
  ]

  const customerSteps = [
    {
      number: '1',
      title: 'Create Account',
      description: 'Sign up as a customer in just 2 minutes',
    },
    {
      number: '2',
      title: 'Search Venues',
      description: 'Browse venues by date, location, and guest count',
    },
    {
      number: '3',
      title: 'Add Services',
      description: 'Choose catering, photography, decoration, and more',
    },
    {
      number: '4',
      title: 'Secure Payment',
      description: 'Pay safely with credit card via PayMongo',
    },
    {
      number: '5',
      title: 'Confirm Booking',
      description: 'Receive booking confirmation and vendor details',
    },
    {
      number: '6',
      title: 'Enjoy Your Event',
      description: 'Connect with vendors and celebrate your event',
    },
  ]

  const features = [
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'All payments are processed securely through PayMongo with encryption',
    },
    {
      icon: Star,
      title: 'Verified Vendors',
      description: 'All vendors are verified and reviewed by real customers',
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Vendors get detailed booking and revenue analytics',
    },
    {
      icon: Zap,
      title: 'Instant Notifications',
      description: 'Get real-time updates on bookings and customer messages',
    },
  ]

  const getColorClass = (color: string, element: string) => {
    const colors: { [key: string]: { [key: string]: string } } = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', button: 'bg-blue-600 hover:bg-blue-700' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', button: 'bg-green-600 hover:bg-green-700' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', button: 'bg-purple-600 hover:bg-purple-700' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', button: 'bg-orange-600 hover:bg-orange-700' },
    }
    return colors[color]?.[element] || colors.blue[element]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto max-w-7xl text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-balance">How Evora events Works</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Evora events connects customers, venue owners, and service providers to create perfect events together.
          </p>
        </div>
      </section>

      {/* Roles Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, idx) => {
              const Icon = role.icon
              const colorClass = getColorClass(role.color, 'bg')
              const textColorClass = getColorClass(role.color, 'text')
              const buttonClass = getColorClass(role.color, 'button')

              return (
                <Card key={idx} className={`p-6 ${colorClass} border-2 ${getColorClass(role.color, 'border')} flex flex-col h-full`}>
                  <div className="mb-4">
                    <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${textColorClass}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>

                  <div className="mb-6 flex-1">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">Benefits:</p>
                    <ul className="space-y-2">
                      {role.benefits.map((benefit, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${textColorClass}`} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {role.disabled ? (
                    <Button disabled className="w-full opacity-50">
                      {role.cta}
                    </Button>
                  ) : (
                    <Button asChild className={`w-full text-white ${buttonClass}`}>
                      <Link href={role.link}>{role.cta}</Link>
                    </Button>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Customer Journey Section */}
      <section className="px-4 py-16 bg-blue-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Customer Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {step.number}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
                {idx < customerSteps.length - 1 && (
                  <div className="hidden lg:flex justify-center mt-6">
                    <ArrowRight className="h-6 w-6 text-blue-400 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section className="px-4 py-16 bg-green-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Secure Payment Processing</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">PayMongo Integration</p>
                    <p className="text-sm text-muted-foreground">Secure credit card and digital payments</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">SSL Encryption</p>
                    <p className="text-sm text-muted-foreground">All transactions are encrypted</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Instant Confirmation</p>
                    <p className="text-sm text-muted-foreground">Payments confirmed instantly with receipts</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Dispute Resolution</p>
                    <p className="text-sm text-muted-foreground">Protected by our dispute resolution process</p>
                  </div>
                </li>
              </ul>
            </div>
            <Card className="p-8 bg-white">
              <h3 className="text-xl font-semibold mb-6">Payment Flow</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                  <p>Customer adds items to cart</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                  <p>Proceeds to secure checkout</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
                  <p>Enters payment information</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">4</div>
                  <p>PayMongo processes payment</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">✓</div>
                  <p>Booking confirmed with receipt</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Is Evora events secure?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, Evora events uses industry-standard SSL encryption and PayMongo for secure payment processing. All vendor information is verified.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">What is the booking fee?</h3>
              <p className="text-muted-foreground text-sm">
                Evora events doesn't charge a booking fee. Customers only pay for the venue and services they select.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">How do I cancel a booking?</h3>
              <p className="text-muted-foreground text-sm">
                You can cancel bookings within 48 hours for a full refund. After 48 hours, cancellations are subject to vendor policies.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Can I switch from customer to service provider?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade your account. Go to your profile and select "Become a Service Provider" to complete registration.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100">Join thousands of happy customers and vendors on Evora events</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {!isLoggedIn && (
              <>
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/signup">Create Account</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                  <Link href="/signin">Sign In</Link>
                </Button>
              </>
            )}
            {isLoggedIn && (
              <>
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/venues">Browse Venues</Link>
                </Button>
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/service-provider/register">Become Provider</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
