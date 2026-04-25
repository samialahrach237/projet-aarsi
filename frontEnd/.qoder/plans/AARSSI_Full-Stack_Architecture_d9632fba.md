# AARSSI Full-Stack Architecture Plan

## 📋 Overview

AARSSI is an event services marketplace connecting users with wedding/event service providers (halls, negafa, catering, photography, etc.). The platform has three roles: User, Provider, and Admin.

---

## 🗄️ Phase 1: Database Design

### 1.1 Users Table
```
- id (primary key)
- name (string)
- email (string, unique)
- password (hashed)
- role (enum: 'user', 'provider', 'admin')
- phone (string, nullable)
- created_at
- updated_at
```

### 1.2 Services Table
```
- id (primary key)
- title (string)
- description (text)
- category (string: 'salle', 'negafa', 'traiteur', 'photographie', 'dj', 'bijoux', 'tyafar')
- price (decimal)
- city (string)
- image (string)
- provider_id (foreign key → users.id)
- created_at
- updated_at
```

### 1.3 Reservations Table
```
- id (primary key)
- user_id (foreign key → users.id)
- service_id (foreign key → services.id)
- date (date)
- guests_number (integer)
- status (enum: 'pending', 'confirmed', 'cancelled')
- notes (text, nullable)
- created_at
- updated_at
```

### 1.4 Reviews Table
```
- id (primary key)
- user_id (foreign key → users.id)
- service_id (foreign key → services.id)
- rating (integer: 1-5)
- comment (text, nullable)
- created_at
- updated_at
```

---

## 🔗 Phase 2: Models & Relationships

### 2.1 User Model
```php
// Relationships
- services() → hasMany(Service::class)  // if provider
- reservations() → hasMany(Reservation::class)
- reviews() → hasMany(Review::class)

// Helper Methods
- isUser() → bool
- isProvider() → bool
- isAdmin() → bool
```

### 2.2 Service Model
```php
// Relationships
- provider() → belongsTo(User::class)
- reservations() → hasMany(Reservation::class)
- reviews() → hasMany(Review::class)
```

### 2.3 Reservation Model
```php
// Relationships
- user() → belongsTo(User::class)
- service() → belongsTo(Service::class)
```

### 2.4 Review Model
```php
// Relationships
- user() → belongsTo(User::class)
- service() → belongsTo(Service::class)
```

---

## 🔐 Phase 3: Authentication System (Laravel Sanctum)

### 3.1 Technology: Laravel Sanctum (Recommended)
- Simple token-based authentication
- Perfect for SPAs (React)
- No complex OAuth setup needed

### 3.2 Auth Flow
```
1. User registers → Laravel creates account → Returns token
2. User logs in → Laravel validates → Returns token
3. React stores token in localStorage
4. Every API request includes: Authorization: Bearer {token}
5. User logs out → Laravel invalidates token
```

### 3.3 Auth Endpoints
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get token
- `POST /api/auth/logout` - Logout (invalidate token)
- `GET /api/auth/me` - Get current user info

---

## 👥 Phase 4: Role-Based Access Control

### 4.1 Role Definitions
```
USER: Can browse services, make reservations, leave reviews
PROVIDER: Can manage own services, view reservations for their services
ADMIN: Can manage all services, users, reservations, reviews
```

### 4.2 Middleware Structure
```php
// app/Http/Middleware/CheckRole.php
- Checks if user has required role
- Returns 403 if unauthorized

// Route Protection Examples
- Route::middleware('auth:sanctum', 'role:provider') → Only providers
- Route::middleware('auth:sanctum', 'role:admin') → Only admins
- Route::middleware('auth:sanctum') → Any authenticated user
```

### 4.3 Route Protection Matrix
```
Public Routes (No Auth):
- GET /api/services
- GET /api/services/{id}
- GET /api/services/{id}/reviews
- POST /api/auth/register
- POST /api/auth/login

User Routes (auth required):
- POST /api/reservations
- GET /api/user/reservations
- POST /api/reviews
- POST /api/auth/logout

Provider Routes (provider role):
- POST /api/services
- PUT /api/services/{id}
- DELETE /api/services/{id}
- GET /api/provider/reservations

Admin Routes (admin role):
- All provider routes +
- GET /api/admin/users
- DELETE /api/reviews/{id}
- PUT /api/reservations/{id}/status
```

---

## 📡 Phase 5: API Endpoints Structure

### 5.1 Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### 5.2 Services
```
GET    /api/services                    → List all services (with filters)
GET    /api/services/{id}               → Get service details
POST   /api/services                    → Create service (provider only)
PUT    /api/services/{id}               → Update service (provider only)
DELETE /api/services/{id}               → Delete service (provider/admin)
```

### 5.3 Reservations
```
POST   /api/reservations                → Create reservation (user)
GET    /api/user/reservations           → Get user's reservations
GET    /api/provider/reservations       → Get provider's service reservations
PUT    /api/reservations/{id}           → Update reservation status
GET    /api/reservations/{id}           → Get reservation details
```

### 5.4 Reviews
```
POST   /api/reviews                     → Create review (user)
GET    /api/services/{id}/reviews       → Get service reviews
PUT    /api/reviews/{id}                → Update review (owner)
DELETE /api/reviews/{id}                → Delete review (owner/admin)
```

### 5.5 Admin Routes
```
GET    /api/admin/users                 → List all users
PUT    /api/admin/users/{id}/role       → Change user role
GET    /api/admin/reservations          → All reservations
DELETE /api/admin/reviews/{id}          → Delete any review
```

---

## 🎨 Phase 6: React Frontend Integration

### 6.1 Project Structure (Your Current Frontend)
```
src/
├── api/
│   └── api.js              → Axios instance & API calls
├── components/
│   └── ...                 → Reusable components
├── pages/
│   ├── Accueil.js          → Homepage
│   ├── Services.js         → Browse services
│   ├── Reservation.js      → Make reservation
│   ├── Avis.js             → Reviews
│   ├── Connexion.js        → Login/Register
│   ├── UserDashboard.js    → User dashboard
│   ├── ProviderDashboard.js→ Provider dashboard
│   └── Admin.js            → Admin panel
└── context/
    └── AuthContext.js      → Auth state management
```

### 6.2 API Configuration
```javascript
// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',  // Laravel API
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 6.3 Authentication Context
```javascript
// src/context/AuthContext.js
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    api.post('/auth/logout');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 6.4 Example: Fetch Services
```javascript
// src/pages/Services.js
import { useState, useEffect } from 'react';
import api from '../api/api';

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {services.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
```

### 6.5 Example: Submit Reservation
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/reservations', {
      service_id: serviceId,
      date: formData.date,
      guests_number: formData.guests,
      notes: formData.notes
    });
    alert('Reservation successful!');
  } catch (err) {
    alert('Error: ' + err.response?.data?.message);
  }
};
```

---

## 🌐 Phase 7: CORS Configuration (Critical!)

### 7.1 Laravel CORS Setup
```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],  // React dev server
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
```

### 7.2 Common CORS Errors & Fixes
```
❌ "No 'Access-Control-Allow-Origin' header"
✅ Add React URL to allowed_origins in config/cors.php

❌ "Method not allowed"
✅ Ensure allowed_methods includes all HTTP methods

❌ "Credentials mode" errors
✅ Set supports_credentials to true
```

---

## 📁 Phase 8: Laravel Backend Structure

```
laravel-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── ServiceController.php
│   │   │   │   ├── ReservationController.php
│   │   │   │   └── ReviewController.php
│   │   │   └── Controller.php
│   │   └── Middleware/
│   │       └── CheckRole.php
│   └── Models/
│       ├── User.php
│       ├── Service.php
│       ├── Reservation.php
│       └── Review.php
├── database/
│   └── migrations/
│       ├── create_users_table.php
│       ├── create_services_table.php
│       ├── create_reservations_table.php
│       └── create_reviews_table.php
├── routes/
│   └── api.php                  → All API routes
└── config/
    └── cors.php                 → CORS configuration
```

---

## 🚀 Phase 9: Development Workflow

### Step-by-Step Implementation Order:

1. **Setup Laravel Project**
   ```bash
   composer create-project laravel/laravel aarssi-backend
   cd aarssi-backend
   ```

2. **Install Sanctum**
   ```bash
   composer require laravel/sanctum
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   php artisan migrate
   ```

3. **Create Migrations**
   - Run migration commands to create tables

4. **Create Models**
   - Build models with relationships

5. **Create Controllers**
   - Implement API logic

6. **Setup Routes**
   - Define all API endpoints

7. **Configure CORS**
   - Allow React frontend access

8. **Test with Postman**
   - Verify all endpoints work

9. **Connect React Frontend**
   - Create api.js with Axios
   - Update components to use real API
   - Test full flow

---

## 🧪 Phase 10: Testing Strategy

### 10.1 Postman Collection
```
- Auth: Register, Login, Logout
- Services: CRUD operations
- Reservations: Create, View, Update
- Reviews: Create, Read
```

### 10.2 Testing Checklist
- [ ] User can register
- [ ] User can login and get token
- [ ] Token is required for protected routes
- [ ] Provider can only manage own services
- [ ] User can make reservation
- [ ] Reviews are linked to services
- [ ] CORS allows React requests
- [ ] Error messages are clear

---

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "email": ["Email already exists"]
  }
}
```

---

## 🔑 Key Implementation Notes

1. **Always validate input** in controllers
2. **Use HTTP status codes** correctly (200, 201, 400, 401, 403, 404, 500)
3. **Return consistent JSON responses**
4. **Use try-catch blocks** for error handling
5. **Add comments** to explain complex logic
6. **Test each endpoint** before moving to next
7. **Keep business logic in controllers** (simple for beginners)
8. **Use Eloquent relationships** instead of manual queries

---

## 🎯 Next Steps After Plan Approval

Once you approve this plan, I will:

1. ✅ Create complete Laravel backend code
2. ✅ Provide all migration files
3. ✅ Build all models with relationships
4. ✅ Create API controllers
5. ✅ Setup authentication with Sanctum
6. ✅ Configure CORS for React
7. ✅ Create React API integration files
8. ✅ Provide Postman collection
9. ✅ Give step-by-step connection guide

**Ready to proceed? Let me know if you want any modifications to this plan!**