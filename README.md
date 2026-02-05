# GashaDrift Car Rental API

A comprehensive REST API for the GashaDrift car rental platform built with NestJS, TypeScript, and PostgreSQL. This API provides backend services for vehicle management, user authentication, reservations, payments, and customer support.

## Features

- **User Management**: Registration, authentication with JWT tokens, role-based access control (Admin/Customer)
- **Vehicle Management**: CRUD operations for vehicles with availability tracking and filtering
- **Reservation System**: Complete booking flow with date range validation and availability checks
- **Payment Processing**: Payment proof handling and transaction management
- **Customer Support**: Support ticket system for customer assistance
- **File Storage**: AWS S3/MinIO integration for vehicle images and document uploads
- **API Documentation**: Auto-generated Swagger documentation
- **Security**: JWT authentication, bcrypt password hashing, role-based guards

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **File Storage**: AWS S3 SDK (compatible with MinIO)
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Development**: NestJS CLI, ts-node

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- MinIO (or AWS S3) for file storage

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd Gasha-Drift-Car-Rental-api
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gasha_drift
DB_SYNCHRONIZE=true

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN_SECONDS=604800

# MinIO/AWS S3
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=gasha-drift
MINIO_PUBLIC_BASE_URL=http://localhost:9000

# Admin Seed
ADMIN_SEED_NAME=Admin
ADMIN_SEED_EMAIL=admin@gashadrift.local
ADMIN_SEED_PHONE=+251900000000
ADMIN_SEED_PASSWORD=ChangeMe123!
```

### 3. Database Setup

Ensure PostgreSQL is running and create the database:

```sql
CREATE DATABASE gasha_drift;
```

The API will automatically create tables on first run (with `DB_SYNCHRONIZE=true`).

### 4. Seed Admin User

Create the initial admin user:

```bash
npm run seed:admin
```

### 5. Start Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Once running, visit `http://localhost:3000/api/docs` for interactive Swagger documentation.

### Base URL

All API endpoints are prefixed with `/api`

### Authentication

The API uses JWT Bearer tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🔗 API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register new customer user
- `POST /login` - Login and receive JWT token
- `GET /me` - Get current user profile (requires auth)
- `GET /admin/test` - Admin guard test (admin only)

### Vehicles (`/api/vehicles`)

- `GET /` - List vehicles with optional filters (location, type, status, date range)
- `GET /:id` - Get vehicle by ID
- `POST /` - Create vehicle (admin only)
- `PATCH /:id` - Update vehicle (admin only)
- `DELETE /:id` - Delete vehicle (admin only)
- `GET /admin/test` - Admin guard test (admin only)

### Users (`/api/users`)

- `GET /profile` - Get user profile (requires auth)
- `PATCH /profile` - Update user profile (requires auth)

### Reservations (`/api/reservations`)

- `GET /` - List reservations (filtered by user for customers, all for admin)
- `GET /:id` - Get reservation by ID
- `POST /` - Create reservation (requires auth)
- `PATCH /:id/status` - Update reservation status (admin only)

### Payments (`/api/payments`)

- `POST /proof` - Upload payment proof (requires auth)
- `GET /proofs` - List payment proofs (admin only)

### Support (`/api/support`)

- `POST /tickets` - Create support ticket (requires auth)
- `GET /tickets` - List support tickets (admin only)
- `PATCH /tickets/:id` - Update support ticket (admin only)

## 📊 Data Models

### User Entity

```typescript
{
  id: string,
  role: 'Admin' | 'Customer',
  name: string,
  email: string,
  phone: string,
  address?: string,
  kebeleIdPhotoUrl?: string,
  licenseNumber?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Vehicle Entity

```typescript
{
  id: string,
  make: string,
  model: string,
  year: number,
  type: 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'Luxury' | 'Sports',
  pricePerDay: number,
  imageUrl: string,
  status: 'Available' | 'Rented' | 'Maintenance' | 'Unavailable',
  location: string,
  transmission: 'Automatic' | 'Manual',
  seats: number,
  fuelType: string,
  licensePlate: string,
  description?: string,
  rentedUntil?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Reservation Entity

```typescript
{
  id: string,
  userId: string,
  vehicleId: string,
  startDate: string,
  endDate: string,
  totalPrice: number,
  status: 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens with configurable expiration
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS enabled for cross-origin requests

## Project Structure

```
src/
├── modules/
│   ├── auth/              # Authentication & authorization
│   ├── users/             # User management
│   ├── vehicles/          # Vehicle inventory
│   ├── reservations/      # Booking system
│   ├── payments/          # Payment processing
│   └── support/           # Customer support
├── shared/
│   └── storage/           # File storage service
├── app.module.ts          # Root module
├── main.ts                # Application bootstrap
└── common/                # Shared utilities
```

## Testing

The project structure includes testing setup. Run tests with:

```bash
npm test
```

## Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start:prod
```

### Environment Variables for Production

Set `DB_SYNCHRONIZE=false` in production and use database migrations instead of automatic schema sync.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the UNLICENSED license.

## Support

For API support and issues, please use the support system or contact the development team.

---

**Note**: This API is designed to work with the GashaDrift frontend application but can be used independently as a standalone car rental backend service.
