'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { VenueCard } from '@/components/VenueCard'
import { venues, categories, locations, venueThemes } from '@/lib/data'
import { Search, Sparkles } from 'lucide-react'

export default function VenuesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [selectedTheme, setSelectedTheme] = useState('All Themes')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredVenues = venues.filter(venue => {
    const matchCategory = selectedCategory === 'All' || venue.category === selectedCategory
    const matchLocation = selectedLocation === 'All Locations' || venue.location === selectedLocation
    const matchTheme = selectedTheme === 'All Themes' || venue.theme === selectedTheme
    const matchSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       venue.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchLocation && matchTheme && matchSearch
  })

  const sortedVenues = filteredVenues

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Venues</h1>
          <p className="text-muted-foreground">Find the perfect venue for your event</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Venues</label>
              <div className="flex items-center border border-input rounded-lg px-3">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 outline-none"
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
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center pt-4 border-t border-border">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Theme:</span>
            {venueThemes.map(theme => (
              <Button
                key={theme}
                variant={selectedTheme === theme ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTheme(theme)}
                className={selectedTheme === theme ? 'bg-blue-600 text-white' : ''}
              >
                {theme}
              </Button>
            ))}
          </div>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {sortedVenues.length} venue{sortedVenues.length !== 1 ? 's' : ''}
          </p>
        </div>

        {sortedVenues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVenues.map(venue => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No venues found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </Card>
        )}
      </div>
    </div>
  )
}
