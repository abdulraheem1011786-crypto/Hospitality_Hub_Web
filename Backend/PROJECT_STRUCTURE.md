# Hospitality Hub - Project Structure & Best Practices Guide

## Overview
This document outlines the improved Laravel project structure, best practices implemented, and guidelines for maintaining code quality and scalability.

---

## 1. Project Structure Overview

```
Backend/
├── app/
│   ├── Console/          # Artisan commands
│   ├── Exceptions/       # Exception handling
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/    # (DEPRECATED - use Api/ instead)
│   │   │   ├── Api/      # All API controllers (unified namespace)
│   │   │   │   ├── AdminHotelController.php
│   │   │   │   ├── AdminHighTeaController.php
│   │   │   │   ├── AdminEventHallController.php
│   │   │   │   ├── ImageController.php        # Moved from Admin/
│   │   │   │   ├── VenueController.php
│   │   │   │   ├── BookingController.php
│   │   │   │   └── AuthController.php
│   │   ├── Middleware/   # Custom middleware
│   │   ├── Requests/     # Form request validation classes
│   │   ├── Resources/    # API resource classes for response formatting
│   │   ├── Traits/       # NEW: Shared traits for response formatting
│   │   │   └── ApiResponse.php  # Standardized response wrapper
│   │   └── Kernel.php
│   ├── Models/           # Eloquent models
│   ├── Services/         # Business logic service classes
│   │   └── VenueSearchService.php  # NEW: Venue search/filter logic
│   ├── Providers/
│   └── ...
├── routes/
│   ├── api.php           # Main API entry point (REORGANIZED)
│   ├── web.php           # Web routes (CLEANED UP)
│   └── api/              # Modular route files
│       ├── auth.php      # Authentication endpoints
│       ├── venues.php    # Public venue endpoints
│       ├── bookings.php  # Booking endpoints (PREFIXED)
│       └── admin.php     # Admin CRUD endpoints
├── database/
│   ├── migrations/       # Database schema
│   ├── seeders/          # Data seeders
│   └── factories/        # Model factories for testing
├── tests/                # Test cases
├── config/               # Configuration files
├── storage/              # Logs, cache, file uploads
└── vendor/               # Composer dependencies
```

---

## 2. Changes Made & Improvements

### 2.1 Controller Namespace Consistency ✅
**Issue:** ImageController was in `App\Http\Controllers\Admin\` while other admin controllers were in `App\Http\Controllers\Api\`

**Fix:**
- Moved `ImageController` from `Admin/` to `Api/` namespace
- Updated route imports in [routes/api/admin.php](Backend/routes/api/admin.php)
- **Benefit:** Consistent controller organization and easier imports

### 2.2 DRY Violation - Venue Search Logic ✅
**Issue:** VenueController methods (hotels(), highTea(), eventHalls()) contained duplicate filtering logic

**Solution:**
- Created [App/Services/VenueSearchService.php](Backend/app/Services/VenueSearchService.php)
- Extracted common filtering logic into reusable methods
- VenueController now uses dependency injection to use the service
- **Benefits:**
  - Code reusability across multiple controllers
  - Single source of truth for search logic
  - Easier to test and maintain
  - Simpler to add new filters

### 2.3 Missing Pagination ✅
**Issue:** Index endpoints used `.all()` or `.get()` returning all records - potential performance/memory issues

**Updated Controllers:**
- `AdminHotelController::index()` - Now uses `.paginate(15)`
- `AdminHighTeaController::index()` - Now uses `.paginate(15)`
- `AdminEventHallController::index()` - Now uses `.paginate(15)`
- `VenueController::hotels/highTea/eventHalls()` - Now uses `.paginate(15)`
- `BookingController::index()` - Now uses `.paginate(15)`

**Pagination Details:**
- Default page size: 15 records per page
- Clients can customize with `?per_page=20` query parameter
- Includes pagination metadata (current_page, last_page, total, etc.)

### 2.4 Security - Development Code Removal ✅
**Issue:** `/seed-db` route was publicly accessible in [routes/web.php](Backend/routes/web.php)

**Fix:**
- Removed public seed route
- Added comment directing developers to use `php artisan db:seed` instead
- **Benefit:** Prevents accidental database resets in production

### 2.5 Route Organization ✅
**Issues Fixed:**
- Modular route files now at TOP of [routes/api.php](Backend/routes/api.php) for readability
- Added bookings route prefix: `/api/bookings` instead of mixed `/api/bookings`
- Better comments explaining route organization

### 2.6 Standardized API Response Format ✅
**New Trait:** [App/Http/Traits/ApiResponse.php](Backend/app/Http/Traits/ApiResponse.php)

**Methods Available:**
```php
$this->successResponse($data, $message, $statusCode);
$this->errorResponse($message, $statusCode, $errors);
$this->paginatedResponse($paginated, $message, $statusCode);
```

**Usage in Controllers:**
```php
use App\Http\Traits\ApiResponse;

class ExampleController extends Controller {
    use ApiResponse;
    
    public function store(Request $request) {
        $data = Model::create($request->validated());
        return $this->successResponse($data, 'Created successfully', 201);
    }
}
```

---

## 3. Best Practices Implemented

### 3.1 Service Layer Pattern
- **Purpose:** Separate business logic from controllers
- **Example:** VenueSearchService handles complex filtering logic
- **Benefit:** Reusability, testability, and separation of concerns

### 3.2 Form Request Validation
- Using Laravel Form Requests for request validation
- Keeps validation rules organized and reusable
- Examples: `StoreHotelRequest`, `UpdateHotelRequest`, etc.

### 3.3 API Resources
- Using Laravel Resource classes for response formatting
- Examples: `HotelResource`, `HighTeaVenueResource`, etc.
- Benefits: Consistent response structure, field filtering, transformations

### 3.4 Dependency Injection
- Controllers use constructor injection for services
- Example: `VenueController` injects `VenueSearchService`
- Benefit: Testable, loosely coupled code

### 3.5 Route Organization
- Routes organized by feature in separate files
- Each file has clear responsibility:
  - `auth.php` - Authentication routes
  - `venues.php` - Public venue browsing
  - `bookings.php` - User bookings
  - `admin.php` - Admin CRUD operations
- Benefits: Scalable, maintainable, easy to navigate

### 3.6 Middleware-Based Access Control
- Using role-based middleware for admin routes
- Middleware defined: `role:admin,vendor`
- Applied to entire admin route group

---

## 4. API Endpoint Summary

### Authentication Routes (`/api/auth`)
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/logout        - Logout user
POST   /api/auth/refresh       - Refresh token
```

### Public Venue Routes (`/api`)
```
GET    /api/hotels?...filters  - Get hotels with pagination
GET    /api/high-tea?...       - Get high tea venues with pagination
GET    /api/event-halls?...    - Get event halls with pagination
GET    /api/search?q=term      - Unified search across all venues
```

### Booking Routes (`/api/bookings`)
```
GET    /api/bookings           - User's bookings (paginated)
POST   /api/bookings           - Create booking
```

### Admin Routes (`/api/admin`) - Requires `auth:sanctum` + `role:admin,vendor`
```
GET    /api/admin/hotels              - List hotels (paginated)
POST   /api/admin/hotels              - Create hotel
PATCH  /api/admin/hotels/{id}         - Update hotel
DELETE /api/admin/hotels/{id}         - Delete hotel

GET    /api/admin/high-tea            - List venues (paginated)
POST   /api/admin/high-tea            - Create venue
PATCH  /api/admin/high-tea/{id}       - Update venue
DELETE /api/admin/high-tea/{id}       - Delete venue

GET    /api/admin/event-halls         - List halls (paginated)
POST   /api/admin/event-halls         - Create hall
PATCH  /api/admin/event-halls/{id}    - Update hall
DELETE /api/admin/event-halls/{id}    - Delete hall

POST   /api/admin/images/upload                    - Upload images
GET    /api/admin/images/venue/{type}/{id}        - Get venue images
PATCH  /api/admin/images/{id}                     - Update image metadata
PATCH  /api/admin/images/{id}/set-primary         - Set primary image
DELETE /api/admin/images/{id}                     - Delete image
```

---

## 5. Development Guidelines

### 5.1 Creating a New Controller
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Http\Requests\StoreRequest;
use App\Http\Resources\Resource;
use App\Models\Model;

class NewController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $items = Model::paginate(15);
        return Resource::collection($items);
    }

    public function store(StoreRequest $request)
    {
        $item = Model::create($request->validated());
        return $this->successResponse(
            new Resource($item),
            'Created successfully',
            201
        );
    }
}
```

### 5.2 Adding New Routes
1. Create/update file in `routes/api/`
2. Add `require` statement in `routes/api.php`
3. Follow naming conventions: use resource route names
4. Group related routes together
5. Apply appropriate middleware (auth, role-based)

### 5.3 Creating a Service Class
```php
<?php
namespace App\Services;

class NewService
{
    public function doSomething()
    {
        // Business logic here
    }
}
```

Then inject in controller:
```php
public function __construct(NewService $service)
{
    $this->service = $service;
}
```

### 5.4 Database Seeding
Instead of `/seed-db` endpoint, use:
```bash
php artisan db:seed
php artisan db:seed --class=SpecificSeeder
```

---

## 6. Performance Considerations

### 6.1 Pagination
- All index endpoints now paginate with 15 records per page
- Clients can request: `GET /api/hotels?page=2&per_page=20`
- Metadata included in response for UI pagination controls

### 6.2 Eager Loading
- Use `.with()` to eagerly load relationships when needed
- Example: `Booking::with('bookable')->paginate(15)`
- Prevents N+1 query problems

### 6.3 Query Optimization
- Use `select()` to limit columns when fetching many records
- Use `whereIn()` instead of multiple `where()` for multiple values
- Add database indexes on frequently filtered columns

---

## 7. Security Best Practices

### 7.1 Authentication
- Using Laravel Sanctum for token-based API authentication
- Tokens included in `Authorization: Bearer {token}` header
- Refresh tokens available via `/api/auth/refresh`

### 7.2 Authorization
- Role-based access control via `role` middleware
- Admin routes protected by `auth:sanctum` + `role:admin,vendor`
- User routes protected by `auth:sanctum` only

### 7.3 Input Validation
- All inputs validated via Form Request classes
- No direct `$request->input()` without validation
- Custom validation rules in dedicated requests

### 7.4 File Uploads
- Image uploads validated by type and size
- Files stored outside web root
- Generated filenames are unique and secure

---

## 8. Common Patterns & Examples

### 8.1 Adding a Filter to VenueSearchService
```php
// In VenueSearchService::filterHotels()
if ($request->filled('amenities')) {
    $query->whereHas('amenities', function ($q) use ($request) {
        $q->whereIn('name', explode(',', $request->amenities));
    });
}
```

### 8.2 Creating a New Admin Resource Controller
```bash
# 1. Create migration
php artisan make:migration create_resources_table

# 2. Create model
php artisan make:model Resource -m

# 3. Create controller
php artisan make:controller Api/ResourceController --api

# 4. Create form requests
php artisan make:request StoreResourceRequest
php artisan make:request UpdateResourceRequest

# 5. Create resource class
php artisan make:resource ResourceResource

# 6. Add routes to routes/api/admin.php
Route::apiResource('resources', ResourceController::class);
```

### 8.3 Error Handling Example
```php
try {
    $item = Model::findOrFail($id);
    $item->update($request->validated());
    return $this->successResponse(
        new Resource($item),
        'Updated successfully'
    );
} catch (ModelNotFoundException $e) {
    return $this->errorResponse('Resource not found', 404);
} catch (Exception $e) {
    Log::error($e->getMessage());
    return $this->errorResponse('Server error', 500);
}
```

---

## 9. Testing

### 9.1 Running Tests
```bash
php artisan test
php artisan test --filter TestClassName
php artisan test tests/Feature/VenueControllerTest.php
```

### 9.2 Test Template for Controllers
```php
<?php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Hotel;

class HotelControllerTest extends TestCase
{
    public function test_can_list_hotels_with_pagination()
    {
        Hotel::factory()->count(20)->create();
        
        $response = $this->getJson('/api/hotels');
        
        $response->assertOk()
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'name', 'location', 'price_per_night']
                     ],
                     'meta' => ['pagination']
                 ]);
    }

    public function test_admin_can_create_hotel()
    {
        $user = User::factory()->admin()->create();
        
        $response = $this->actingAs($user)
                         ->postJson('/api/admin/hotels', [
                             'name' => 'New Hotel',
                             'location' => 'City Center',
                             'price_per_night' => 100
                         ]);
        
        $response->assertCreated();
        $this->assertDatabaseHas('hotels', ['name' => 'New Hotel']);
    }
}
```

---

## 10. Troubleshooting

### Issue: "Class not found" errors
**Solution:** Run `composer dump-autoload` after creating new classes

### Issue: Pagination not working
**Solution:** Ensure model uses `Illuminate\Pagination\Paginator` or upgrade Laravel

### Issue: Service injection failing
**Solution:** Register service in AppServiceProvider or use auto-wiring (Laravel 5.3+)

### Issue: CORS errors
**Solution:** Check `config/cors.php` and ensure frontend URL is whitelisted

---

## 11. Future Improvements

1. **API Versioning:** Implement `/api/v1/` and `/api/v2/` for backward compatibility
2. **Caching:** Add Redis caching for frequently accessed venues
3. **Search Engine:** Implement Elasticsearch for advanced search
4. **Rate Limiting:** Add rate limiting middleware for API endpoints
5. **Logging:** Implement structured logging with ELK stack
6. **Documentation:** Generate API docs with Swagger/OpenAPI
7. **GraphQL:** Consider GraphQL as alternative to REST
8. **Events & Listeners:** Implement event-driven architecture for complex workflows

---

## Contact & Support

For questions or improvements, refer to the main README.md or contact the development team.

**Last Updated:** May 3, 2026
