'use client'

import Image from 'next/image'
import { Service } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { useState } from 'react'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { addToCart } = useApp()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    addToCart({
      id: service.id,
      type: 'service',
      name: service.name,
      price: service.price,
      quantity,
      date: new Date().toISOString().split('T')[0],
    })
    setQuantity(1)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40 bg-muted">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.name}
          fill
          className="object-cover"
        />
        <Badge className="absolute left-3 top-3 bg-green-600 text-white">{service.category}</Badge>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-balance">{service.name}</h3>
          <p className="text-sm text-muted-foreground">{service.provider}</p>
        </div>

        <p className="text-sm text-foreground/80">{service.description}</p>

        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{service.rating}</span>
        </div>

        <div className="pt-2 border-t border-border space-y-2">
          <div className="text-lg font-bold text-green-600">₱{service.price.toLocaleString()}</div>
          <Button onClick={handleAddToCart} className="w-full bg-green-600 hover:bg-green-700 text-white">
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  )
}
