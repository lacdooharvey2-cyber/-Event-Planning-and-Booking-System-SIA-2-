'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Venue } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Star, Users } from 'lucide-react'
import { useState } from 'react'

interface VenueCardProps {
  venue: Venue
}

export function VenueCard({ venue }: VenueCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-muted">
        <Image
          src={venue.image || "/placeholder.svg"}
          alt={venue.name}
          fill
          className="object-cover"
        />
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute right-3 top-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-600 text-red-600' : 'text-gray-600'}`} />
        </button>
        <Badge className="absolute left-3 top-3 bg-blue-600 text-white">{venue.category}</Badge>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-balance">{venue.name}</h3>
          <p className="text-sm text-muted-foreground">{venue.location}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{venue.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({venue.reviews} reviews)</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Up to {venue.capacity} guests</span>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-blue-600">₱{venue.price.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">per booking</span>
          </div>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={`/venues/${venue.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
