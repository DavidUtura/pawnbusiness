# Pawn.ge Admin Panel - Quick Start Guide

## 🎯 What's Implemented

### Backend (Spring Boot)
- ✅ Audit logging system with `@Auditable` annotation
- ✅ Analytics module with dashboard endpoints
- ✅ Multi-tenant security architecture
- ✅ Role-based access control (CUSTOMER, LOMBARD_ADMIN, LOMBARD_EMPLOYEE, SUPER_ADMIN)
- ✅ REST API structure following `/api/v1/` versioning

### Frontend (Next.js 16 + React 19)
- ✅ Admin Dashboard with KPIs
- ✅ Sidebar navigation with all required modules
- ✅ Header with user menu and actions
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ "Needs Attention" priority system
- ✅ Recent orders table
- ✅ Top products analytics
- ✅ Inventory summary

## 🚀 How to Run

### Option 1: Frontend Only (Fastest)

```bash
cd /workspace/pawn-ge/frontend
npm run dev
```

Then navigate to: **http://localhost:3000/admin/dashboard**

### Option 2: Full Stack with Docker

```bash
cd /workspace/pawn-ge
docker compose up -d --build
```

This starts:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/dashboard
- **Backend API**: http://localhost:8080/api/v1
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **MinIO (S3)**: http://localhost:9001

### Option 3: Backend Only

```bash
cd /workspace/pawn-ge/backend
mvn spring-boot:run
```

## 📁 Project Structure

```
pawn-ge/
├── backend/
│   └── src/main/java/ge/pawn/
│       ├── auth/           # JWT authentication
│       ├── product/        # Product CRUD
│       ├── lombard/        # Pawn shop management
│       ├── branch/         # Branch management
│       ├── inventory/      # Stock tracking
│       ├── order/          # Order processing
│       ├── reservation/    # Reservations
│       ├── customer/       # Customer management
│       ├── analytics/      # Analytics & reporting ✨ NEW
│       └── common/         # Shared utilities ✨ NEW (Audit)
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── admin/
│       │   │   ├── dashboard/  ✨ NEW
│       │   │   ├── products/
│       │   │   ├── inventory/
│       │   │   ├── orders/
│       │   │   ├── reservations/
│       │   │   ├── customers/
│       │   │   ├── branches/
│       │   │   ├── analytics/
│       │   │   ├── payments/
│       │   │   ├── users/
│       │   │   └── settings/
│       │   └── ...
│       └── components/
│           └── admin/     ✨ NEW
│               ├── AdminSidebar.tsx
│               ├── AdminHeader.tsx
│               └── KpiCard.tsx
│
└── docker-compose.yml
```

## 🔐 User Roles

| Role | Access Level |
|------|-------------|
| `CUSTOMER` | Browse products, place orders, make reservations |
| `LOMBARD_EMPLOYEE` | View/edit products, orders, reservations (configurable) |
| `LOMBARD_ADMIN` | Full access to pawn shop operations |
| `SUPER_ADMIN` | Platform-wide access, manage all pawn shops |

## 📊 Admin Dashboard Features

### KPI Cards
- Today's Sales
- Orders count
- Active Products
- Reservations (with expiry warnings)

### Needs Attention Section
Priority-based alerts:
- 🔴 High: Orders awaiting confirmation, Failed payments
- 🟡 Medium: Reservations expiring today
- ⚪ Low: Products missing photos

### Recent Orders
Real-time order status tracking with color-coded badges

### Top Products
Performance metrics: views, reservations, sales

## 🛠️ Next Steps to Complete

### Phase 1 - Core Operations (In Progress)
- [x] Dashboard
- [ ] Products list page with filters
- [ ] Add Product form (multi-step)
- [ ] Inventory management
- [ ] Orders management
- [ ] Reservations management

### Phase 2 - Business Management
- [ ] Customers CRUD
- [ ] Branches management
- [ ] Payments integration
- [ ] Users & Roles (RBAC)
- [ ] Analytics charts

### Phase 3 - Platform Operations
- [ ] Super Admin panel
- [ ] Audit logs viewer
- [ ] Support ticket system

### Phase 4 - Advanced Features
- [ ] Digital Pawn module
- [ ] Device diagnostics integration
- [ ] KYC workflows
- [ ] Loan management

## 🔧 API Endpoints Available

### Authentication
```
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/refresh
```

### Products
```
GET    /api/v1/products
GET    /api/v1/products/{id}
POST   /api/v1/products
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
```

### Analytics
```
GET /api/v1/analytics/dashboard  (Lombard Admin)
GET /api/v1/analytics/platform   (Super Admin)
GET /api/v1/analytics/sales
GET /api/v1/analytics/products
GET /api/v1/analytics/inventory
```

### Orders, Reservations, Customers, Branches
(To be implemented)

## 🎨 Design System

**Colors:**
- Primary: Green (#16a34a)
- Background: Warm neutral grays
- Cards: White with subtle shadows
- Text: Dark charcoal (#111827)

**Typography:**
- Headings: Bold, clear hierarchy
- Body: Inter font family
- Monospace: For IDs and technical data

**Components:**
- Rounded corners (lg/xl)
- Generous whitespace
- Subtle hover effects
- Priority-based color coding

## 📝 Testing the Admin Panel

1. **Start the frontend:**
   ```bash
   cd /workspace/pawn-ge/frontend
   npm run dev
   ```

2. **Navigate to:** http://localhost:3000/admin/dashboard

3. **Explore:**
   - Click sidebar items to navigate
   - Test responsive design (resize browser)
   - Click "Add Product" button
   - Open user menu (top right)

4. **Mobile view:**
   - Resize browser to mobile width
   - Click hamburger menu to open sidebar
   - Verify all interactions work

## 🐛 Known Limitations (MVP)

- Mock data (not connected to backend yet)
- Authentication not enforced in frontend
- Some routes are placeholders
- No real-time updates
- Image upload not implemented

## ✅ Production Checklist

Before going live:
- [ ] Connect frontend to backend APIs
- [ ] Implement JWT authentication flow
- [ ] Add tenant isolation checks
- [ ] Set up environment variables
- [ ] Configure S3 storage
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Load testing
- [ ] Security audit

---

**Version:** 1.0  
**Last Updated:** 2026-01-XX  
**Status:** Frontend MVP / Backend-ready
