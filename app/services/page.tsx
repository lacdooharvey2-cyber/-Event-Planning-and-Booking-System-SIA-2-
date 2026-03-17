'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ServiceCard } from '@/components/ServiceCard'
import { services, serviceCategories } from '@/lib/data'
import { Search, Settings2 } from 'lucide-react'

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const filteredServices = services.filter(service => {
    const matchCategory = selectedCategory === 'All' || service.category === selectedCategory
    const matchSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       service.provider.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchSearch
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      default:
        return 0 // popular (keep original order)
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Event Services</h1>
          <p className="text-muted-foreground">Find the perfect services to complement your event</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Services</label>
              <div className="flex items-center border border-input rounded-lg px-3">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <input
                  type="text"
                  placeholder="Search by service or provider..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              >
                <option value="All">All Services</option>
                {serviceCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center pt-4 border-t border-border">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Sort by:</span>
            {['popular', 'price-low', 'price-high', 'rating'].map(option => (
              <Button
                key={option}
                variant={sortBy === option ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy(option)}
                className={sortBy === option ? 'bg-green-600 text-white' : ''}
              >
                {option === 'popular' && 'Most Popular'}
                {option === 'price-low' && 'Price: Low to High'}
                {option === 'price-high' && 'Price: High to Low'}
                {option === 'rating' && 'Highest Rated'}
              </Button>
            ))}
          </div>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {sortedServices.length} service{sortedServices.length !== 1 ? 's' : ''}
          </p>
        </div>

        {sortedServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </Card>
        )}
      </div>
    </div>
  )
}
