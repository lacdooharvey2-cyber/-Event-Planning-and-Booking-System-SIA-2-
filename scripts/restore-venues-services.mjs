import fs from 'node:fs'
import path from 'node:path'
import mysql from 'mysql2/promise'

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
}

const venues = [
  {
    id: 1,
    name: 'Secret Garden Pavilion',
    category: 'Garden',
    location: 'Metro Manila',
    price: 28000,
    capacity: 120,
    image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    rating: 4.8,
    reviews: 156,
    description: 'Intimate garden venue with covered pavilion, ideal for elegant celebrations.',
    amenities: JSON.stringify(['On-site parking (40 slots)', 'Bridal holding room', 'Basic sound system']),
  },
  {
    id: 2,
    name: 'Botanical Garden Venue',
    category: 'Garden',
    location: 'Quezon City',
    price: 36000,
    capacity: 180,
    image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    rating: 4.7,
    reviews: 142,
    description: 'Botanical venue with landscaped gardens and a semi-covered reception area.',
    amenities: JSON.stringify(['On-site parking (60 slots)', 'Air-cooled pavilion', 'Wi-Fi for guests']),
  },
  {
    id: 3,
    name: 'Glass Garden Hall',
    category: 'Function Room',
    location: 'Makati',
    price: 62000,
    capacity: 350,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    rating: 4.9,
    reviews: 203,
    description: 'Large premium hall with floor-to-ceiling glass walls and full event tech setup.',
    amenities: JSON.stringify(['Centralized air conditioning', 'Parking (100 slots)', 'Generator backup']),
  },
  {
    id: 4,
    name: 'Sunset Deck Beach Venue',
    category: 'Beach',
    location: 'Cavite',
    price: 26000,
    capacity: 100,
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    rating: 4.5,
    reviews: 73,
    description: 'Affordable beachfront deck for intimate family events and ceremonies.',
    amenities: JSON.stringify(['Beach access', 'Tent setup', 'Portable PA system']),
  },
  {
    id: 5,
    name: 'Studio White Events Hub',
    category: 'Studio',
    location: 'Quezon City',
    price: 18000,
    capacity: 70,
    image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
    rating: 4.6,
    reviews: 91,
    description: 'Bright white studio space perfect for small celebrations and shoots.',
    amenities: JSON.stringify(['Air conditioning', 'Kids play corner', 'Photo backdrop wall']),
  },
]

const services = [
  {
    id: 1,
    name: 'Professional Photography',
    category: 'Photography',
    price: 6500,
    description: '8 hours of professional event photography',
    image_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80',
    rating: 4.9,
    provider: 'Lens & Light Studios',
  },
  {
    id: 2,
    name: 'DJ & Sound System',
    category: 'Entertainment',
    price: 5500,
    description: 'Professional DJ with complete sound and lighting setup',
    image_url: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d7b?w=800&q=80',
    rating: 4.8,
    provider: 'Beat Masters Entertainment',
  },
  {
    id: 3,
    name: 'Catering Service',
    category: 'Catering',
    price: 12000,
    description: 'Full meal service for 100 guests with menu options',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',
    rating: 4.7,
    provider: 'Delicious Catering Co.',
  },
  {
    id: 4,
    name: 'Photo Booth (3 Hours)',
    category: 'Photography',
    price: 4200,
    description: 'Unlimited photo booth prints with props and digital copy.',
    image_url: 'https://images.unsplash.com/photo-1529634895163-5dd9f3b0f661?w=800&q=80',
    rating: 4.8,
    provider: 'SmileBox Booths',
  },
  {
    id: 5,
    name: 'Event Coordination (Day-of)',
    category: 'Planning',
    price: 7000,
    description: 'Day-of event coordinator with 2 assistants.',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    rating: 4.9,
    provider: 'PlanRight Events',
  },
]

async function main() {
  loadEnvLocal()

  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'evora_events_db',
  })

  try {
    console.log('🔄 Starting to restore venues and services...\n')

    // Insert venues
    console.log('📍 Inserting venues with images...')
    for (const v of venues) {
      await connection.query(
        `INSERT INTO venues (id, name, category, location, price, capacity, image_url, rating, reviews, description, amenities)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          category = VALUES(category),
          location = VALUES(location),
          price = VALUES(price),
          capacity = VALUES(capacity),
          image_url = VALUES(image_url),
          rating = VALUES(rating),
          reviews = VALUES(reviews),
          description = VALUES(description),
          amenities = VALUES(amenities)`,
        [v.id, v.name, v.category, v.location, v.price, v.capacity, v.image_url, v.rating, v.reviews, v.description, v.amenities]
      )
      console.log(`✅ Added: ${v.name}`)
    }

    // Insert services
    console.log('\n🎉 Inserting services with images...')
    for (const s of services) {
      await connection.query(
        `INSERT INTO services (id, name, category, price, description, image_url, rating, provider)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          category = VALUES(category),
          price = VALUES(price),
          description = VALUES(description),
          image_url = VALUES(image_url),
          rating = VALUES(rating),
          provider = VALUES(provider)`,
        [s.id, s.name, s.category, s.price, s.description, s.image_url, s.rating, s.provider]
      )
      console.log(`✅ Added: ${s.name}`)
    }

    console.log('\n✨ Restoration complete!')
    console.log(`📍 Venues added: ${venues.length}`)
    console.log(`🎉 Services added: ${services.length}`)

    // Verify data
    const [[venueCount]] = await connection.query('SELECT COUNT(*) as count FROM venues')
    const [[serviceCount]] = await connection.query('SELECT COUNT(*) as count FROM services')
    console.log(`\n📊 Database now has:`)
    console.log(`   - ${venueCount.count} venues`)
    console.log(`   - ${serviceCount.count} services`)

  } catch (error) {
    console.error('❌ Error restoring data:', error.message)
  } finally {
    await connection.end()
  }
}

main()
