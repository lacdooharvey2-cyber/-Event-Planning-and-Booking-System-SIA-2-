'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import { Calendar, MapPin, Users, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export default function Page() {
  const { isLoggedIn } = useAuth()
  const { setSearchQuery } = useApp()
  const [pax, setPax] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('Metro Manila')

  const handleSearch = () => {
    if (pax && date) {
      setSearchQuery({
        pax: parseInt(pax),
        date,
        location,
        category: 'All',
      })
      // Redirect to venues page
      window.location.href = '/venues'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:py-24 md:py-32">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
              Plan Once. Book Everything.
              <span className="block text-blue-600">Celebrate Without Stress.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Your one-stop platform for event planning and booking. Find the perfect venue, book services, and organize your dream event all in one place.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={isLoggedIn ? '/venues' : '/signup'}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="px-4 -mt-8 relative z-10 pb-16">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6">Find Your Perfect Venue</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Number of Guests</label>
                <div className="flex items-center border border-input rounded-md px-3 py-2">
                  <Users className="h-4 w-4 text-muted-foreground mr-2" />
                  <input
                    type="number"
                    placeholder="e.g., 100"
                    value={pax}
                    onChange={(e) => setPax(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Event Date</label>
                <div className="flex items-center border border-input rounded-md px-3 py-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Location</label>
                <div className="flex items-center border border-input rounded-md px-3 py-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm"
                  >
                    <option>Metro Manila</option>
                    <option>Quezon City</option>
                    <option>Makati</option>
                    <option>Cavite</option>
                    <option>Tagaytay</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Search Venues
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="px-4 py-16">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-balance">How Evora events Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Search Venues', description: 'Browse hundreds of venues in your area' },
              { step: '2', title: 'Book Services', description: 'Add catering, photography, and more' },
              { step: '3', title: 'Make Payment', description: 'Secure checkout with PayMongo' },
              { step: '4', title: 'Celebrate', description: 'Enjoy your perfectly planned event' },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-blue-600 mb-3">{item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 bg-blue-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-balance">Why Choose Evora events?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'One-Stop Solution', description: 'Book venues, services, and manage payments all in one place' },
              { title: 'Trusted Vendors', description: 'Verified venues and service providers with real reviews' },
              { title: 'Best Prices', description: 'Compare options and get the best deals for your budget' },
            ].map((benefit, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <h3 className="font-semibold text-lg">{benefit.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm ml-9">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">Ready to Plan Your Event?</h2>
          <p className="text-lg text-muted-foreground">Start browsing venues and services today. Create your account to get started.</p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={isLoggedIn ? '/venues' : '/signup'}>Get Started Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-12 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/venues" className="hover:text-foreground">Venues</Link></li>
                <li><Link href="/services" className="hover:text-foreground">Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Vendors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/vendor" className="hover:text-foreground">Become a Vendor</Link></li>
                <li><Link href="/vendor/dashboard" className="hover:text-foreground">Vendor Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground">About Us</Link></li>
                <li><Link href="/" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="/" className="hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Evora events. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
