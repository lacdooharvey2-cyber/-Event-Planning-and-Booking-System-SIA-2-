# EventHub - Complete Event Planning Platform

EventHub is a fully functional event planning and booking platform with complete payment processing, multiple user roles, and persistent data storage using localStorage.

## System Architecture

### Persistent Storage System (`lib/storage.ts`)
- All data is stored in localStorage for offline capability and persistence
- Automatically initializes with sample data on first load
- Supports users, bookings, service providers, and services

### Authentication System
- **4 User Roles:**
  - **Customer:** Browse venues, book services, manage bookings
  - **Venue Owner:** Manage venue listings, view bookings
  - **Service Provider:** Manage services (photography, catering, etc.)
  - **Admin:** Monitor platform, manage users and analytics

### Context API State Management
- **AuthContext:** User authentication and role management
- **AppContext:** Cart management, search queries, bookings

## Demo Credentials

All demo accounts use the same password format:

| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@example.com` | `customer123` |
| Venue Owner | `venue@example.com` | `venue123` |
| Service Provider | `provider@example.com` | `provider123` |
| Admin | `admin@example.com` | `admin123` |

**Test Payment Card:** `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/26)
- CVV: Any 3 digits (e.g., 123)

## How to Use

### 1. Try the Demo
Visit `/demo` page to see demo credentials and get started immediately.

### 2. Customer Journey
1. Sign up or log in with customer account
2. Search venues by date, guest count, location
3. Browse and add services (photography, catering, etc.)
4. Proceed to checkout
5. Enter delivery information
6. Complete payment with test card
7. View booking confirmation with reference number

### 3. Vendor Management (Venue Owner / Service Provider)
1. Log in with vendor account
2. Access vendor dashboard from profile menu
3. Manage listings and pricing
4. View bookings and customer inquiries
5. Track revenue and ratings

### 4. Admin Dashboard
1. Log in with admin account
2. Access admin panel from profile menu
3. Monitor platform analytics
4. Manage users and vendors
5. Review system activity

## Features Implemented

### Core Features
- ✅ User authentication with 4 roles
- ✅ Persistent data storage (localStorage)
- ✅ Shopping cart with persistence
- ✅ Advanced venue search and filtering
- ✅ Service provider marketplace
- ✅ Multi-step checkout process
- ✅ Mock payment processing (PayMongo integration)
- ✅ Booking confirmation and tracking
- ✅ Role-based dashboards

### User Dashboards
- **Customer Dashboard:** My bookings, profile management, saved preferences
- **Venue Owner Dashboard:** Listings management, booking view, analytics
- **Service Provider Dashboard:** Services management, bookings, revenue tracking
- **Admin Dashboard:** System analytics, user management, platform overview

### Pages
- Home (`/`) - Landing page with search
- Sign In (`/signin`) - Authentication
- Sign Up (`/signup`) - Role-based registration
- Venues (`/venues`) - Browse all venues
- Venue Details (`/venues/[id]`) - Detailed venue information
- Services (`/services`) - Browse services by category
- Cart (`/cart`) - Review and edit cart
- Checkout (`/checkout`) - 2-step payment process
- Bookings (`/bookings`) - View all bookings
- Booking Details (`/bookings/[id]`) - Booking confirmation
- Profile (`/profile`) - User profile management
- Vendor Dashboard (`/vendor/dashboard`) - Venue owner control
- Service Provider Dashboard (`/service-provider/dashboard`) - Provider control
- Service Provider Registration (`/service-provider/register`) - New provider signup
- Admin Dashboard (`/admin`) - Platform management
- Demo (`/demo`) - Demo credentials and quick start
- How It Works (`/how-it-works`) - Platform explanation

## Data Persistence

### localStorage Keys
- `eventhub_current_user` - Current logged-in user
- `eventhub_users` - All registered users
- `eventhub_bookings` - All bookings
- `eventhub_service_providers` - Service provider profiles
- `eventhub_services` - Available services
- `eventhub_cart` - Shopping cart items

## Payment Process Flow

### Step 1: Customer Information
- Collect full name, email, phone
- Confirm event location

### Step 2: Payment Processing
- Accept card details (card number, expiry, CVV)
- Validate payment information
- Simulate PayMongo processing (2-second delay)
- Generate unique booking ID

### Step 3: Confirmation
- Display booking reference number
- Show total amount paid
- Send confirmation email (simulated)
- Clear cart and redirect to bookings

## Sample Data

### Pre-populated Users
- Customer: Juan Dela Cruz
- Venue Owner: Maria Garcia
- Service Provider: Roberto Santos
- Admin: Admin User

### Sample Venues
- The Grand Ballroom (Function Room)
- Sunset Beach Pavilion (Beach)
- Garden Haven (Garden)
- Rooftop Terrace (Rooftop)

### Sample Services
- Professional Photography (₱15,000)
- Premium Catering (₱800/person)
- Video Coverage (₱12,000)
- Event Decoration (₱8,000)

## Technical Stack

- **Framework:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** React Context API
- **Data Storage:** Browser localStorage
- **Icons:** Lucide React

## Getting Started Locally

1. Clone the repository
2. Install dependencies: `npm install` or `pnpm install`
3. Run development server: `npm run dev`
4. Open http://localhost:3000
5. Navigate to `/demo` for demo credentials

## Key Features Explained

### Real-time Cart Persistence
- Cart items are automatically saved to localStorage
- Persists across page refreshes
- Automatically loads on app startup

### Multi-step Checkout
- Step 1: Collect customer information
- Step 2: Process payment securely
- Step 3: Show confirmation with booking reference

### Role-based Access Control
- Different navigation menus for each role
- Admin-only pages redirect unauthorized users
- Vendor dashboards only accessible to vendors

### Search & Filtering
- Filter venues by category, location, guest capacity
- Sort by price, rating, popularity
- Real-time search updates

## Notes

- All payment processing is simulated (no real charges)
- Data is stored locally and will persist until localStorage is cleared
- Perfect for testing, demos, and development
- Can be easily connected to real payment processor (PayMongo, Stripe, etc.)
- Can be extended with real backend database (Supabase, Firebase, etc.)

## Future Enhancements

- Real PayMongo/Stripe payment integration
- Backend API with real database
- Email notifications
- SMS notifications
- Review and rating system
- Message/chat system between users
- Calendar integration
- Invoice generation
- Refund processing

---

**Version:** 1.0.0  
**Last Updated:** February 2026
