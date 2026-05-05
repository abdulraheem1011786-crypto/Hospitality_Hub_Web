# Hospitality Hub - Admin Dashboard Setup Guide

## 🎉 Admin Dashboard is Ready!

Your complete admin dashboard system has been built with full-featured vendor and system management capabilities.

## 📍 Access Admin Dashboard

**URL:** `http://hospitalityhub.test/admin/admin.html`

## 🔐 Login Credentials

### Demo Account (For Testing)
- **Email:** admin@test.com
- **Password:** password

### Admin Accounts
- **Email:** admin@hospitalityhub.pk
- **Password:** admin123

### Vendor Accounts (For Vendors to Manage Their Venues)
- **Email:** vendor1@hospitalityhub.pk
- **Password:** vendor123
- **Email:** vendor2@hospitalityhub.pk
- **Password:** vendor123

## ✨ Admin Dashboard Features

### 1. **Dashboard Hub**
- Overview statistics for all venue types
- Quick action buttons to add new venues
- Real-time data display

### 2. **Hotel Management**
- ✅ Add new hotels with complete details
- ✅ Edit existing hotel information
- ✅ Delete hotels
- ✅ Manage amenities, pricing, and ratings
- ✅ Track price per night

### 3. **High-Tea Venues Management**
- ✅ Add high-tea venue venues with details
- ✅ Edit venue information
- ✅ Delete venues
- ✅ Manage cuisine type, capacity, pricing
- ✅ Track price per head

### 4. **Event Halls Management**
- ✅ Add event halls with full details
- ✅ Edit hall information
- ✅ Delete halls
- ✅ Manage capacity, full/half-day pricing
- ✅ Track setup options and amenities

### 5. **Bookings Management**
- Placeholder for future implementation
- Real-time booking status tracking (coming soon)
- Customer booking details (coming soon)
- Payment information (coming soon)

### 6. **Settings Page**
- View admin account information
- System information display
- Logout functionality

## 📊 Backend API Endpoints

All admin operations use protected API endpoints:

### Hotels
```
GET    /api/admin/hotels              - List all hotels
POST   /api/admin/hotels              - Create new hotel
GET    /api/admin/hotels/{id}         - Get hotel details
PUT    /api/admin/hotels/{id}         - Update hotel
DELETE /api/admin/hotels/{id}         - Delete hotel
```

### High-Tea Venues
```
GET    /api/admin/high-tea            - List all venues
POST   /api/admin/high-tea            - Create new venue
GET    /api/admin/high-tea/{id}       - Get venue details
PUT    /api/admin/high-tea/{id}       - Update venue
DELETE /api/admin/high-tea/{id}       - Delete venue
```

### Event Halls
```
GET    /api/admin/event-halls         - List all halls
POST   /api/admin/event-halls         - Create new hall
GET    /api/admin/event-halls/{id}    - Get hall details
PUT    /api/admin/event-halls/{id}    - Update hall
DELETE /api/admin/event-halls/{id}    - Delete hall
```

## 🛠️ Setup Instructions

### Step 1: Run Database Migrations
Run this command in your Backend directory:

```bash
php artisan migrate
```

This will:
- Add the `role` column to the users table
- Prepare all necessary tables

### Step 2: Seed Database with Demo Data
Run this command:

```bash
php artisan db:seed
```

This will create:
- Admin accounts
- Vendor accounts
- Demo customer account
- Sample venues (already in database)

### Step 3: Access Admin Dashboard
1. Open browser and go to: `http://hospitalityhub.test/admin/admin.html`
2. Login with demo credentials
3. Start managing venues!

## 🎯 How to Use Each Section

### Adding a Hotel
1. Click "Hotel Management" in sidebar
2. Click "Add New Hotel" button
3. Fill in details:
   - Hotel Name *
   - Location *
   - Description *
   - Price Per Night *
   - Rating (optional)
   - Amenities (comma-separated)
4. Click "Save Hotel"

### Editing a Hotel
1. Go to "Hotel Management"
2. Find the hotel in the table
3. Click the edit (pencil) icon
4. Modify the information
5. Click "Save Hotel"

### Deleting a Hotel
1. Go to "Hotel Management"
2. Find the hotel in the table
3. Click the delete (trash) icon
4. Confirm deletion

### Similar process for High-Tea Venues and Event Halls

## 🔒 Security Features

- ✅ Role-based access control (Admin/Vendor/Customer)
- ✅ Authentication required for all admin operations
- ✅ Only authorized users can add/edit/delete venues
- ✅ Secure token validation for all API requests
- ✅ Protected routes with middleware

## 📁 File Structure

```
Frontend/admin/
├── admin.html           (Main admin page)
├── css/
│   └── admin-style.css (1500+ lines of styling)
├── js/
│   ├── main.js         (Main admin script)
│   ├── services/
│   │   ├── admin-api.js    (API communication)
│   │   └── admin-auth.js   (Authentication)
│   ├── pages/
│   │   ├── admin-login.js
│   │   ├── admin-dashboard.js
│   │   ├── admin-hotels.js
│   │   ├── admin-high-tea.js
│   │   ├── admin-event-halls.js
│   │   ├── admin-bookings.js
│   │   └── admin-settings.js
│   └── utils/
│       └── admin-router.js

Backend/
├── app/Http/Controllers/Api/
│   ├── AdminHotelController.php
│   ├── AdminHighTeaController.php
│   └── AdminEventHallController.php
├── database/
│   └── seeders/
│       └── UserSeeder.php (with role support)
└── routes/
    └── api.php (with admin routes)
```

## 🚀 Next Steps

1. Run migrations: `php artisan migrate`
2. Seed database: `php artisan db:seed`
3. Access admin: `http://hospitalityhub.test/admin/admin.html`
4. Login with demo credentials
5. Start adding/managing venues!

## ❓ Troubleshooting

### Dashboard not loading?
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)
- Verify migrations ran successfully

### Can't login?
- Ensure database is seeded with `php artisan db:seed`
- Check credentials match UserSeeder.php
- Verify `role` column exists in users table

### API errors?
- Check CORS settings in `config/cors.php`
- Verify routes are registered in `routes/api.php`
- Check authentication middleware

## 📝 Notes

- All venues are stored with JSON data for flexible attribute storage
- Amenities and images are stored as JSON arrays
- Full CRUD operations supported for all venue types
- Real-time updates after any CRUD operation
- Responsive design works on all devices

---

**Admin Dashboard is fully operational and ready for use!** 🎉
