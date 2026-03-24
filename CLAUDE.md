# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DesiKing is a full-stack e-commerce platform for premium spices. The frontend is branded as "DesiKing" while the backend codebase is named "Agronexis". Both serve the same product at `desikingspices.com` / `agronexis.com`.

## Repository Structure

```
UI/         ← Next.js 16 frontend (App Router, TypeScript)
Backend/    ← ASP.NET Core 8 backend (multi-project solution)
```

## Frontend (UI/)

### Commands

```bash
cd UI
npm install
npm run dev        # Starts on port 3002
npm run build
npm run lint
npm run lint:fix
```

### Architecture

- **Framework**: Next.js 16 with App Router (`UI/src/app/`)
- **Path alias**: `@/*` maps to `./src/*`
- **Styling**: Material UI v7 + custom theme at `UI/src/styles/theme.ts`
- **Font**: Poppins (defined in `UI/src/styles/fonts.ts`)

**Provider hierarchy** (defined in `AppShell.tsx`):
```
ThemeProvider → ErrorBoundary → NotificationProvider → AnalyticsProvider → GlobalClickTracker → CartProvider
```

**Key layers:**
- `UI/src/services/apiService.ts` — Singleton `ApiService` class; all API calls go through this. Reads JWT from `access_token` cookie. Returns unwrapped `data` field from `ApiResponse<T>` envelope. Retries only on `NetworkError`.
- `UI/src/contexts/CartContext.tsx` — Cart state management with product fetching
- `UI/src/contexts/AnalyticsContext.tsx` — GA4 ecommerce event tracking
- `UI/src/types/` — Shared TypeScript types (products, orders, errors)
- `UI/src/hooks/` — Custom hooks including `useAnalytics`, `usePageTracking`
- `UI/src/utils/errorHandler.ts` — Processes errors into typed `CustomError` hierarchy

**API response envelope** (all backend responses use this shape):
```typescript
{
  info: { isSuccess: boolean; code: string; message: string; }
  data: T | null;
  id: string | null;  // correlation ID
}
```

**Image uploads**: Handled via `UI/src/pages/api/upload.ts` which proxies to Nextcloud via WebDAV using credentials from environment variables.

### Environment Variables (UI/.env)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_NEXTCLOUD_URL/USERNAME/PASSWORD` | Nextcloud WebDAV for image storage |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Payment gateway (server-side) |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Toggle GA4 tracking |

## Backend (Backend/)

### Commands

```bash
cd Backend/Agronexis.Api
dotnet run                         # Development
dotnet build
dotnet run --environment Production
```

The API runs on port 5001. Swagger UI is available at `/swagger` in both Development and Production environments.

### Architecture

Multi-project layered solution:

| Project | Responsibility |
|---------|---------------|
| `Agronexis.Api` | Controllers, middleware, DI wiring (`Program.cs`) |
| `Agronexis.Business` | Business logic via `IConfigService` / `ConfigService` |
| `Agronexis.DataAccess` | EF Core `AppDbContext`, repositories |
| `Agronexis.Model` | Entity models and request/response DTOs |
| `Agronexis.Common` | Shared utilities |
| `Agronexis.ExternalApi` | External integrations (Razorpay, DTDC shipment tracking) |
| `Agronexis.Images` | Image processing |

**Controllers**: Address, Analytics, Auth, Brand, Cart, Category, Checkout, Common, Invoice, Product, Role, Shipment, User — all inherit from `BaseController`.

**Middleware**: `GlobalExceptionHandlerMiddleware` and `RepositoryExceptionHandlerMiddleware` handle all unhandled exceptions and convert them to the standard API response envelope.

**Auth**: JWT Bearer tokens. Config in `appsettings.json` under `Jwt:Issuer`, `Jwt:Audience`, `Jwt:Key`. Frontend stores token in `access_token` cookie.

**Database**: PostgreSQL via EF Core 9, connection string key: `AGRONEXIS_DB_CONNECTION`.

**CORS**: Allows `localhost:3002`, `agronexis.com`, `desikingspices.com`.

## Docker / Production

```bash
docker-compose up --build
```

Services: nginx (reverse proxy + TLS), frontend (Next.js), backend (ASP.NET), postgres, mariadb (Nextcloud), nextcloud.

NGINX routes: `/api/` → backend:5001, `/` → frontend:3002, `cloud.*` → nextcloud:8080.
