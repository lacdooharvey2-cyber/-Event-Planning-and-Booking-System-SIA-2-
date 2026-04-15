import supabase from '@/lib/supabase'
import type { Service, Venue } from '@/lib/data'
import { services as staticServices, venues as staticVenues } from '@/lib/data'

interface SupabaseRow {
  [key: string]: unknown
}

function safeString(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback
  return String(value)
}

function safeNullableString(value: unknown): string | null {
  if (value === null || value === undefined) return null
  return String(value)
}

function safeNumber(value: unknown, fallback = 0): number {
  if (value === null || value === undefined) return fallback
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function parseAmenities(raw: unknown): string[] {
  if (raw == null) return []
  if (typeof raw === 'string') {
    const s = raw.trim()
    if (!s) return []
    try {
      const parsed = JSON.parse(s)
      return Array.isArray(parsed) ? parsed.map(String) : []
    } catch {
      return s.split(',').map((item) => item.trim()).filter(Boolean)
    }
  }
  if (Array.isArray(raw)) {
    return raw.map(String)
  }
  if (raw instanceof Uint8Array || raw instanceof ArrayBuffer) {
    try {
      const text = new TextDecoder('utf-8').decode(raw instanceof Uint8Array ? raw : new Uint8Array(raw))
      return JSON.parse(text)
    } catch {
      return []
    }
  }
  return []
}

export interface Category {
  id: string
  name: string
  description?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface MenuItem {
  id: string
  categoryId: string | null
  name: string
  description?: string | null
  price: number
  imageUrl?: string | null
  categoryName?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface CategoryWithItems extends Category {
  items: MenuItem[]
}

function mapCategoryRow(row: SupabaseRow): Category {
  return {
    id: safeString(row.id),
    name: safeString(row.name, 'Uncategorized'),
    description: safeNullableString(row.description),
    createdAt: safeNullableString(row.created_at),
    updatedAt: safeNullableString(row.updated_at),
  }
}

function mapMenuItemRow(row: SupabaseRow): MenuItem {
  return {
    id: safeString(row.id),
    categoryId: row.category_id ? safeString(row.category_id) : row.categoryId ? safeString(row.categoryId) : null,
    name: safeString(row.name, 'Menu item'),
    description: safeNullableString(row.description),
    price: safeNumber(row.price),
    imageUrl: row.image_url ? safeString(row.image_url) : row.image ? safeString(row.image) : null,
    categoryName: row.category_name ? safeString(row.category_name) : null,
    createdAt: safeNullableString(row.created_at),
    updatedAt: safeNullableString(row.updated_at),
  }
}

function mapVenueRowFromSupabase(row: SupabaseRow): Venue {
  return {
    id: safeString(row.id),
    name: safeString(row.name, 'Venue'),
    category: safeString(row.category, 'Other'),
    theme: safeString(row.theme ?? row.theme_name, 'General'),
    location: safeString(row.location, ''),
    price: safeNumber(row.price),
    capacity: safeNumber(row.capacity),
    image: safeString(row.image_url ?? row.image, '/placeholder.svg'),
    rating: safeNumber(row.rating),
    reviews: safeNumber(row.reviews ?? row.review_count ?? row.reviews_count ?? 0),
    description: safeString(row.description, ''),
    amenities: parseAmenities(row.amenities),
  }
}

function mapServiceRowFromSupabase(row: SupabaseRow): Service {
  return {
    id: safeString(row.id),
    name: safeString(row.name ?? row.service_name, 'Service'),
    category: safeString(row.category, 'Other'),
    price: safeNumber(row.price ?? row.base_price),
    description: safeString(row.description, ''),
    image: safeString(row.image_url ?? row.image, '/placeholder.svg'),
    rating: safeNumber(row.rating),
    provider: safeString(row.provider ?? row.provider_name, 'Evora Partner'),
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }
  return (data ?? []).map(mapCategoryRow)
}

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*, category:category_id(name)')
    .order('name')

  if (error) {
    throw new Error(`Failed to fetch menu items: ${error.message}`)
  }

  return (data ?? []).map((item: SupabaseRow) => ({
    ...mapMenuItemRow(item),
    categoryName: item.category ? safeNullableString((item.category as SupabaseRow).name) : mapMenuItemRow(item).categoryName,
  }))
}

export async function fetchCategoriesWithItems(): Promise<CategoryWithItems[]> {
  const [categories, menuItems] = await Promise.all([fetchCategories(), fetchMenuItems()])
  const map = new Map<string, MenuItem[]>()
  menuItems.forEach((item) => {
    const categoryId = item.categoryId ?? ''
    const bucket = map.get(categoryId) ?? []
    bucket.push(item)
    map.set(categoryId, bucket)
  })

  return categories.map((category) => ({
    ...category,
    items: map.get(category.id) ?? [],
  }))
}

export async function fetchVenuesFromDb(): Promise<Venue[]> {
  try {
    const { data, error } = await supabase.from('venues').select('*').order('id')
    if (error) throw error
    return (data ?? []).map(mapVenueRowFromSupabase)
  } catch (error) {
    console.warn('[catalog-db] fetchVenuesFromDb fallback to static venues', error)
    return staticVenues
  }
}

export async function fetchVenueByIdFromDb(id: string): Promise<Venue | null> {
  try {
    const { data, error } = await supabase.from('venues').select('*').eq('id', id).single()
    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }
    return data ? mapVenueRowFromSupabase(data) : null
  } catch (error) {
    console.warn('[catalog-db] fetchVenueByIdFromDb fallback to static venue', error)
    return staticVenues.find((venue) => venue.id === id) ?? null
  }
}

export async function fetchServicesFromDb(): Promise<Service[]> {
  try {
    const { data, error } = await supabase.from('services').select('*').order('id')
    if (error) throw error
    return (data ?? []).map(mapServiceRowFromSupabase)
  } catch (error) {
    console.warn('[catalog-db] fetchServicesFromDb fallback to static services', error)
    return staticServices
  }
}

// Example usage:
// const categories = await fetchCategories()
// const menuItems = await fetchMenuItems()
// const categoriesWithItems = await fetchCategoriesWithItems()
