# Pawn.ge - Development Guide

## Prerequisites

- **Java 21** (for backend)
- **Node.js 20+** (for frontend)
- **Docker & Docker Compose** (optional, for full stack)
- **PostgreSQL 16** (if running without Docker)
- **Redis 7** (if running without Docker)
- **MinIO** (if running without Docker)

## Quick Start Options

### Option 1: Full Stack with Docker (Recommended)

If you have Docker installed:

```bash
cd /workspace/pawn-ge
docker compose up -d --build
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **MinIO Console**: http://localhost:9001 (login: minioadmin/minioadmin)

To stop:
```bash
docker compose down
```

### Option 2: Frontend Only (Development)

```bash
cd /workspace/pawn-ge/frontend
npm install
npm run dev
```

Visit http://localhost:3000

Note: Backend APIs won't be available, frontend will use mock data.

### Option 3: Backend Only (Development)

First, ensure PostgreSQL and Redis are running:

```bash
# Using Docker for dependencies only
docker run -d --name postgres -e POSTGRES_DB=pawn_ge -e POSTGRES_USER=pawn_user -e POSTGRES_PASSWORD=pawn_password -p 5432:5432 postgres:16-alpine
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

Then run the backend:

```bash
cd /workspace/pawn-ge/backend
./mvnw spring-boot:run
```

API available at http://localhost:8080/api/v1
Swagger UI at http://localhost:8080/api/swagger-ui.html

## Project Structure

```
pawn-ge/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/ge/pawn/
│   │   ├── auth/           # Authentication & JWT
│   │   ├── product/        # Product management
│   │   ├── lombard/        # Pawn shop management
│   │   ├── branch/         # Branch management
│   │   ├── inventory/      # Inventory tracking
│   │   ├── order/          # Order processing
│   │   ├── reservation/    # Reservations
│   │   ├── customer/       # Customer management
│   │   ├── payment/        # Payment integration
│   │   ├── notification/   # Notifications
│   │   └── common/         # Shared utilities
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/   # Flyway migrations
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities & API client
│   │   └── types/        # TypeScript types
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml     # Full stack orchestration
└── README.md             # This file
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/pawn_ge
DATABASE_USERNAME=pawn_user
DATABASE_PASSWORD=pawn_password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET_NAME=pawn-products
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/v3/api-docs

## Default Test Data

The application includes sample data for testing:
- Sample pawn shops (Lombards)
- Sample products
- Sample users with different roles

## User Roles

- **CUSTOMER** - Regular customers browsing products
- **LOMBARD_ADMIN** - Pawn shop administrators
- **LOMBARD_EMPLOYEE** - Pawn shop employees
- **SUPER_ADMIN** - Platform administrators

## Troubleshooting

### Port Already in Use

If ports 3000, 8080, 5432, 6379, or 9000 are in use:

```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>
```

Or change ports in `docker-compose.yml` and `.env` files.

### Database Connection Issues

Ensure PostgreSQL is running and accessible:

```bash
# Check PostgreSQL status
docker ps | grep postgres

# View logs
docker logs pawn-ge-postgres
```

### Build Errors

Clear caches and rebuild:

```bash
# Backend
cd backend
./mvnw clean

# Frontend
cd frontend
rm -rf node_modules .next
npm install
```

## Next Steps

1. **Explore the API** - Use Swagger UI to test endpoints
2. **Customize Configuration** - Update environment variables for your setup
3. **Add Your Data** - Create pawn shops, products, and users
4. **Deploy to Production** - Configure production environment variables and deploy

## Support

For issues or questions, check:
- Technical documentation in `/docs`
- API documentation via Swagger UI
- Source code comments
