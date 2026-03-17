'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { venues } from '@/lib/data'
import { useApp } from '@/contexts/AppContext'
import { Star, Users, MapPin, Calendar, Heart, ArrowLeft, Check } from 'lucide-react'

export default function VenueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const venueId = params.id as string
  const venue = venues.find(v => v.id === venueId)
  const { addToCart } = useApp()
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  if (!venue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Venue Not Found</h2>
          <p className="text-muted-foreground mb-4">The venue you're looking for doesn't exist.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/venues">Back to Venues</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedDate) {
      alert('Please select a date')
      return
    }

    addToCart({
      id: venue.id,
      type: 'venue',
      name: venue.name,
      price: venue.price,
      quantity,
      date: selectedDate,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/venues" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Venues
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="relative h-96 bg-muted rounded-xl overflow-hidden mb-6">
              <Image
                src={venue.image || "/placeholder.svg"}
                alt={venue.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="absolute right-4 top-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
              >
                <Heart className={`h-6 w-6 ${isFavorited ? 'fill-red-600 text-red-600' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Venue Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-3xl font-bold text-balance">{venue.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-1 mt-2">
                      <MapPin className="h-4 w-4" />
                      {venue.location}
                    </p>
                  </div>
                  <Badge className="bg-blue-600">{venue.category}</Badge>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{venue.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({venue.reviews} reviews)</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Up to {venue.capacity} guests
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">About This Venue</h2>
                <p className="text-foreground/80 leading-relaxed">{venue.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {venue.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-foreground/80">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div>
            <Card className="p-6 sticky top-24 space-y-6">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ₱{venue.price.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">per booking</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Select Event Date</label>
                <div className="flex items-center border border-input rounded-lg px-3 py-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center gap-2 border border-input rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₱{(venue.price * quantity).toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className={`w-full text-white transition-all ${isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isAdded ? 'Booked ✓' : 'Book Now'}
              </Button>

              <Link href="/cart" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  View Cart
                </Button>
              </Link>

              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <h4 className="font-semibold text-sm text-blue-900">What's Included?</h4>
                <ul className="text-xs text-blue-900 space-y-1">
                  <li>✓ Venue rental for 8 hours</li>
                  <li>✓ Tables and chairs setup</li>
                  <li>✓ Basic lighting and sound</li>
                  <li>✓ Parking for 50 vehicles</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
