# 2026-03-16 Audit Fixes

This document summarizes the full implementation pass completed after auditing auth, data contracts, schema coverage, and frontend-backend configuration consistency.

## Scope

- Backend schema and admin contract alignment
- Frontend/backend API contract cleanup
- Environment-driven configuration
- Auth flow hardening
- Logout and navigation behavior cleanup in Angular
- Documentation updates for reproducible setup

## What Was Fixed

### 1) Schema mismatch that broke admin setup

Problem:

- Backend `POST /initAdmin` inserted into `users.is_user` and `businesses`.
- SQL schema did not define `is_user` or `businesses`.
- Result: admin initialization failed at runtime.

Fix:

- Added `is_user BOOLEAN NOT NULL DEFAULT true` to `users`.
- Added `businesses` table with user-linked primary key and admin/business fields.

Files:

- `backend/db/init.sql`

### 2) Admin payload contract mismatch (`CompanyName` vs `companyName`)

Problem:

- Frontend model used `CompanyName` while backend JSON binding expected `companyName`.
- Business name was not reliably transferred.

Fix:

- Frontend model now uses `companyName`.
- Added `starterCode` to admin payload contract.
- Admin signup component maps form inputs into `admin.companyName`, `admin.starterCode`, and `admin.seriesLimit`.
- Backend admin struct and insert logic updated to use these fields.

Files:

- `src/app/models/admin.model.ts`
- `src/app/components/admin/admin-sign-up/admin-sign-up.ts`
- `src/app/components/admin/admin-sign-up/admin-sign-up.html`
- `backend/main.go`

### 3) Hardcoded API URLs across frontend

Problem:

- URLs were duplicated and hardcoded (`http://localhost:8080`) in multiple services/guards.
- Any host/port change required touching several files.

Fix:

- Added `src/environments/environment.ts` with `apiBaseUrl`.
- Refactored services/guards to derive endpoints from `environment.apiBaseUrl`.

Files:

- `src/environments/environment.ts`
- `src/app/services/user-service.ts`
- `src/app/services/admin-service.ts`
- `src/app/guards/auth-guard.ts`
- `src/app/guards/guest-guard.ts`

### 4) JWT security baseline

Problem:

- Backend used a weak fallback (`defaultsecret`) when `JWT_KEY` was missing.

Fix:

- `JWT_KEY` is now required and must be at least 32 characters.
- Backend fails fast on startup if `JWT_KEY` is weak/missing.

Files:

- `backend/main.go`
- `backend/.env.example`
- `README.md`
- `docs/configuration.md`

### 5) CORS flexibility and local-dev reliability

Problem:

- Single hardcoded allowed origin (`http://localhost:4200`) caused friction with host variants.

Fix:

- Added `CORS_ALLOWED_ORIGINS` (comma-separated).
- Default supports both `http://localhost:4200` and `http://127.0.0.1:4200`.
- CORS now reflects request origin when allowed.

Files:

- `backend/main.go`
- `backend/.env.example`
- `README.md`
- `docs/backend.md`
- `docs/configuration.md`

### 6) Navbar logout/navigation behavior

Problem:

- Navbar used raw `fetch` and `window.location.href`, bypassing Angular router/service patterns.

Fix:

- Added `UserService.logout()` API call.
- Navbar now uses Angular router + service-based logout handling.

Files:

- `src/app/services/user-service.ts`
- `src/app/components/navbar/navbar.ts`

## Why These Changes Matter

- Prevents immediate runtime failures in admin initialization.
- Keeps frontend and backend data contracts consistent.
- Makes local/staging/prod host changes configuration-only.
- Improves auth safety with a mandatory strong JWT secret.
- Reduces brittle client-side navigation/network code.
- Provides a clearer baseline for upcoming features (coupons, rewards, codes, redemption lifecycle).

## Verification Status

- Frontend build: passed (`npm run build`).
- Go runtime checks: not run in this environment (Go toolchain unavailable on machine).

## Suggested Next Steps

- Install Go locally and run backend tests/build checks.
- Migrate existing databases before applying new schema in shared environments.
- Add endpoint-level validation for signup/admin payloads on backend.
- Add a dedicated migration strategy if schema evolves frequently.
