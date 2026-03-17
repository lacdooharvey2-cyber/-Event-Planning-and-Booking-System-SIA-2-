# EventHub - Ready-to-Use Setup Guide

EventHub is now fully configured and ready to use! All systems are working locally with persistent storage.

## What's Ready

### ✅ Complete Payment System
- **2-Step Checkout Process:**
  - Step 1: Collect customer information (name, email, phone, address)
  - Step 2: Process payment with card details
  - Step 3: Show confirmation with booking reference

- **Test Card:** `4242 4242 4242 4242`
- **Payment Simulation:** 2-second processing time for realistic feel
- **Booking Confirmation:** Auto-generated booking reference numbers

### ✅ All 4 User Roles
- **Customer** - Browse, book, pay, view bookings
- **Venue Owner** - Manage venue listings
- **Service Provider** - Manage services and bookings
- **Admin** - Platform management and analytics

### ✅ Persistent Data Storage
- All data stored in browser localStorage
- Automatically initializes with sample data
- Cart persists across sessions
- User sessions maintained

### ✅ Complete Feature Set
- Venue search and filtering
- Service marketplace
- Shopping cart
- Checkout process
- Booking management
- User dashboards
- Vendor dashboards
- Admin panel

## Quick Start (3 Steps)

### Step 1: Start the App
```bash
pnpm dev
# or
npm run dev
```

Visit: http://localhost:3000

### Step 2: Visit Demo Page
Click "Try Demo" button on homepage, or go to: http://localhost:3000/demo

### Step 3: Choose a Role & Sign In
Use any demo account:
- **Customer:** customer@example.com / customer123
- **Venue Owner:** venue@example.com / venue123
- **Service Provider:** provider@example.com / provider123
- **Admin:** admin@example.com / admin123

## Complete User Journey

### Customer Flow
1. Sign in with customer account
2. Search venues → Filter by date, guests, location
3. View venue details and add to cart
4. Browse services → Add photography/catering/etc to cart
5. Go to cart → Review items and prices
6. Checkout → Enter info → Pay with test card
7. See confirmation with booking reference
8. View booking in "My Bookings"

### Venue Owner Flow
1. Sign in with venue account
2. Go to Vendor Dashboard
3. View venue listings
4. Check incoming bookings
5. View revenue and ratings

### Service Provider Flow
1. Sign in with service provider account
2. Go to Service Provider Dashboard
3. Manage service listings
4. View bookings for services
5. Track revenue and bookings

### Admin Flow
1. Sign in with admin account
2. Go to Admin Dashboard
3. Monitor system analytics
4. Manage users
5. Review platform activity

## Testing Payment Process

### Test Payment Steps
1. Add items to cart
2. Click "Proceed to Checkout"
3. Enter customer information:
   - Name: Any name
   - Email: Any email
   - Phone: Any phone number
   - Address: Optional

4. Click "Continue to Payment"
5. Enter card details:
   - Card Number: `4242 4242 4242 4242`
   - Expiry: `12/26` (or any future date)
   - CVV: `123` (or any 3 digits)

6. Click "Pay Now"
7. Wait 2 seconds for processing
8. See confirmation with booking reference
9. Booking saved with 12% tax applied

## Key Features Demonstrated

### Working Systems
- ✅ User authentication with roles
- ✅ Product browsing and search
- ✅ Shopping cart with persistence
- ✅ Multi-step checkout
- ✅ Payment processing simulation
- ✅ Booking confirmation
- ✅ Data persistence
- ✅ Role-based access

### Admin Features
- Dashboard with system overview
- User management
- Booking analytics
- Revenue tracking

### Vendor Features
- Service/venue listings management
- Booking management
- Revenue tracking
- Customer inquiries

### Customer Features
- Venue/service browsing
- Cart management
- Checkout process
- Booking history
- Profile management

## Data Storage Details

### What's Stored Locally
- User accounts and login info
- Shopping cart items
- Completed bookings
- Service provider listings
- Service details
- Venue information

### localStorage Keys Used
```
eventhub_current_user
eventhub_users_list
eventhub_bookings
eventhub_service_providers
eventhub_services
eventhub_cart
```

### Clearing Data
To reset all data, open browser DevTools and run:
```javascript
// Clear specific item
localStorage.removeItem('eventhub_current_user');

// Clear all EventHub data
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('eventhub_')) {
    localStorage.removeItem(key);
  }
});
```

## Sample Test Scenarios

### Scenario 1: Complete Booking
1. Login as customer
2. Search for venues in Metro Manila
3. Filter by date (any future date)
4. Add a venue to cart
5. Add 2-3 services to cart
6. Checkout and pay
7. View booking confirmation

### Scenario 2: Vendor Dashboard
1. Login as venue owner
2. Check vendor dashboard
3. View sample bookings
4. Check revenue metrics

### Scenario 3: Admin Overview
1. Login as admin
2. Check admin dashboard
3. View platform analytics
4. Monitor bookings and users

## Customization Ready

The system is configured to easily integrate with:
- **Real Database:** Connect Supabase, Firebase, or any backend
- **Real Payments:** Integrate PayMongo, Stripe, or other processors
- **Email Service:** Add SendGrid, Mailgun, or AWS SES
- **File Storage:** Connect to cloud storage for images/documents

## Troubleshooting

### Cart Not Persisting
- Check if localStorage is enabled in browser
- Clear cache and reload

### Payment Not Processing
- Ensure you use test card: `4242 4242 4242 4242`
- Check browser console for errors

### Bookings Not Showing
- Make sure you're logged in
- Check My Bookings page
- Verify localStorage data in DevTools

### Demo Accounts Not Working
- Ensure exact email match (case-sensitive)
- Use correct password
- Try clearing localStorage and refreshing

## Next Steps

### To Deploy
1. Export to ZIP
2. Install with: `npx create-next-app@latest`
3. Deploy to Vercel: `vercel deploy`

### To Enhance
1. Add real payment gateway
2. Connect to backend database
3. Add email notifications
4. Implement admin approval workflow
5. Add review/rating system
6. Add messaging between users

## Support

### Demo Page
Visit http://localhost:3000/demo for:
- Demo credentials
- Quick start guide
- Feature overview
- Test card information

### Documentation
- README.md - Full system documentation
- This file - Setup and usage guide

---

**Status:** ✅ READY TO USE
**Last Updated:** February 2026
**Version:** 1.0.0

All systems operational. Start demo at: http://localhost:3000/demo
