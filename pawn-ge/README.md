# Pawn.ge - Development Guide

## Quick Start

### Prerequisites
- Node.js 20+ 
- Java 21+
- Maven 3.8+
- Docker (optional, for full stack)

### Option 1: Run Frontend Only

```bash
cd /workspace/frontend
npm install
npm run dev
```

Visit http://localhost:3000

### Option 2: Run Backend Only

First, start PostgreSQL and Redis:

**Using Docker:**
```bash
cd /workspace/pawn-ge
docker-compose up -d postgres redis
```

**Or install locally:**
```bash
# Debian/Ubuntu
sudo apt-get install postgresql redis-server

# Start services
sudo service postgresql start
sudo service redis-server start

# Create database
sudo -u postgres createdb pawn_ge
```

Then run the backend:

```bash
cd /workspace/pawn-ge/backend
mvn spring-boot:run
```

Visit http://localhost:8080/api/v1/products

API Documentation: http://localhost:8080/swagger-ui.html

### Option 3: Run Everything with Docker Compose

```bash
cd /workspace/pawn-ge
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- MinIO (S3) on ports 9000 (API) and 9001 (Console)
- Backend on port 8080
- Frontend on port 3000

Access points:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/v1
- Swagger UI: http://localhost:8080/swagger-ui.html
- MinIO Console: http://localhost:9001 (login: minioadmin/minioadmin)

## Project Structure

```
/workspace
├── frontend/              # Next.js 16 + React 19 + TypeScript
│   ├── src/app/          # App router pages
│   │   ├── page.tsx      # Home page
│   │   ├── products/     # Products listing
│   │   ├── lombards/     # Lombards listing
│   │   ├── account/      # User account
│   │   └── admin/        # Admin panel
│   └── package.json
│
└── pawn-ge/
    ├── backend/          # Spring Boot 3.4 + Java 21
    │   ├── src/main/java/ge/pawn/
    │   │   ├── auth/     # Authentication & JWT
    │   │   ├── product/  # Product management
    │   │   ├── lombard/  # Pawn shop management
    │   │   └── common/   # Common utilities
    │   ├── src/main/resources/
    │   │   ├── db/migration/  # Flyway migrations
    │   │   └── application.yml
    │   └── pom.xml
    │
    ├── docker-compose.yml
    └── docker/
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16.x with App Router
- **React**: 19.x
- **Styling**: Tailwind CSS 4.x
- **Language**: TypeScript 5.x

### Backend
- **Framework**: Spring Boot 3.4.1
- **Language**: Java 21
- **Database**: PostgreSQL 16
- **ORM**: JPA/Hibernate
- **Migrations**: Flyway
- **Security**: Spring Security + JWT
- **Cache**: Redis
- **Storage**: S3-compatible (MinIO for development)
- **Documentation**: OpenAPI/Swagger

## Environment Variables

### Backend (.env or environment variables)
```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/pawn_ge
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
REDIS_HOST=localhost
REDIS_PORT=6379
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
JWT_SECRET=your-super-secret-key-change-in-production-minimum-32-chars
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/{id}` - Get product by ID
- `POST /api/v1/products` - Create product (authenticated)
- `PUT /api/v1/products/{id}` - Update product (authenticated)
- `DELETE /api/v1/products/{id}` - Delete product (authenticated)

### Lombards
- `GET /api/v1/lombards` - List all lombards
- `GET /api/v1/lombards/{id}` - Get lombard by ID
- `POST /api/v1/lombards` - Create lombard (admin)
- `PUT /api/v1/lombards/{id}` - Update lombard (admin)
- `DELETE /api/v1/lombards/{id}` - Delete lombard (admin)

## Development Commands

### Frontend
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

### Backend
```bash
mvn clean install           # Build project
mvn spring-boot:run        # Run application
mvn test                   # Run tests
mvn spotless:apply         # Format code
```

## Database Schema

The initial schema is managed by Flyway migration `V1__initial_schema.sql`:
- `lombards` - Pawn shops
- `branches` - Shop branches
- `users` - Users (customers, employees, admins)
- `products` - Products for sale
- `product_images` - Product images
- `customers` - Customer profiles
- `orders` - Customer orders
- `reservations` - Product reservations
- `payments` - Payment records
- `notifications` - User notifications

## User Roles

- `CUSTOMER` - Regular customer
- `LOMBARD_ADMIN` - Pawn shop administrator
- `LOMBARD_EMPLOYEE` - Pawn shop employee
- `SUPER_ADMIN` - Platform administrator

## Security

- JWT-based authentication with access and refresh tokens
- Role-based access control (RBAC)
- Multi-tenant isolation by `lombard_id`
- Password hashing with BCrypt
- CORS configuration for frontend

## Next Steps

1. ✅ Frontend home page with modern design
2. ✅ Basic routing structure
3. ✅ Backend entities and repositories
4. ✅ Authentication system
5. ✅ Product CRUD APIs
6. ✅ Lombard management APIs
7. ⏳ Connect frontend to backend APIs
8. ⏳ Implement product search and filtering
9. ⏳ Add image upload functionality
10. ⏳ Implement orders and reservations
11. ⏳ Add payment integration
12. ⏳ Build complete admin panel

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running: `sudo service postgresql status`
- Verify database exists: `sudo -u postgres psql -c "\l"`
- Check Redis connection: `redis-cli ping`

### Frontend build errors
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Check Node version: `node --version` (should be 20+)

### Docker issues
- Stop all containers: `docker-compose down`
- Remove volumes: `docker-compose down -v`
- Rebuild: `docker-compose up --build`
