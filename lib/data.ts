export interface Venue {
  id: string
  name: string
  category: string
  theme: string
  location: string
  price: number
  capacity: number
  image: string
  rating: number
  reviews: number
  description: string
  amenities: string[]
}

export interface Service {
  id: string
  name: string
  category: string
  price: number
  description: string
  image: string
  rating: number
  provider: string
}

export const venues: Venue[] = [
  {
    id: 'v1',
    name: 'Secret Garden Pavilion',
    category: 'Garden',
    theme: 'Wedding',
    location: 'Metro Manila',
    price: 45000,
    capacity: 200,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    rating: 4.8,
    reviews: 156,
    description: 'Enchanting garden venue with lush greenery and elegant pavilion',
    amenities: ['Parking', 'Catering', 'Sound System', 'Garden Lights'],
  },
  {
    id: 'v2',
    name: 'Botanical Garden Venue',
    category: 'Garden',
    theme: 'Wedding',
    location: 'Quezon City',
    price: 55000,
    capacity: 300,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    rating: 4.7,
    reviews: 142,
    description: 'Beautiful botanical gardens perfect for intimate or grand celebrations',
    amenities: ['Parking', 'Catering', 'WiFi', 'Tables & Chairs'],
  },
  {
    id: 'v3',
    name: 'Glass Garden Hall',
    category: 'Function Room',
    theme: 'Corporate',
    location: 'Makati',
    price: 60000,
    capacity: 400,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    rating: 4.9,
    reviews: 203,
    description: 'Modern glass hall with panoramic views and natural lighting',
    amenities: ['Parking', 'AC', 'Sound System', 'Stage'],
  },
  {
    id: 'v4',
    name: 'Night Bar by the Beach',
    category: 'Beach',
    theme: 'Birthday',
    location: 'Cavite',
    price: 40000,
    capacity: 250,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    rating: 4.6,
    reviews: 98,
    description: 'Beachfront bar venue with sunset views and dance floor',
    amenities: ['Beach Access', 'Bar Service', 'DJ Booth', 'Lighting'],
  },
  {
    id: 'v5',
    name: 'Fine Dining Rooftop with Fireworks',
    category: 'Rooftop',
    theme: 'Debut',
    location: 'Manila',
    price: 85000,
    capacity: 150,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    rating: 5,
    reviews: 267,
    description: 'Luxury rooftop venue with city views and premium dining experience',
    amenities: ['Parking', 'Catering', 'Fireworks', 'Bar'],
  },
]

export const services: Service[] = [
  {
    id: 's1',
    name: 'Professional Photography',
    category: 'Photography',
    price: 15000,
    description: '8 hours of professional event photography',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80',
    rating: 4.9,
    provider: 'Lens & Light Studios',
  },
  {
    id: 's2',
    name: 'DJ & Sound System',
    category: 'Entertainment',
    price: 12000,
    description: 'Professional DJ with complete sound and lighting setup',
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d7b?w=800&q=80',
    rating: 4.8,
    provider: 'Beat Masters Entertainment',
  },
  {
    id: 's3',
    name: 'Catering Service',
    category: 'Catering',
    price: 25000,
    description: 'Full meal service for 100 guests with menu options',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',
    rating: 4.7,
    provider: 'Delicious Catering Co.',
  },
  {
    id: 's4',
    name: 'Floral Decoration',
    category: 'Decoration',
    price: 20000,
    description: 'Premium floral arrangements and venue decoration',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    rating: 4.9,
    provider: 'Bloom & Blossom Designs',
  },
  {
    id: 's5',
    name: 'Videography',
    category: 'Videography',
    price: 18000,
    description: '8 hours of professional video coverage with editing',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    rating: 4.8,
    provider: 'Cinema Craft Productions',
  },
]

export const categories = ['All', 'Function Room', 'Garden', 'Beach', 'Rooftop', 'Ballroom', 'Loft', 'Studio']
export const venueThemes = ['All Themes', 'Wedding', 'Kiddie Party', 'Debut', 'Birthday', 'Corporate', 'Christening', 'Reunion']
export const locations = ['All Locations', 'Metro Manila', 'Quezon City', 'Makati', 'Cavite', 'Manila', 'Tagaytay']
export const serviceCategories = ['Photography', 'Videography', 'Entertainment', 'Catering', 'Decoration', 'Planning']
