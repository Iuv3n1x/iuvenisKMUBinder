# Environment and Configuration

## Frontend

Frontend API base URL is centralized in:

- `src/environments/environment.ts`
  - `apiBaseUrl: 'http://localhost:8080'`

Services and guards build endpoint URLs from `apiBaseUrl`.

Affected frontend files:

- `src/app/services/user-service.ts`
- `src/app/services/admin-service.ts`
- `src/app/guards/auth-guard.ts`
- `src/app/guards/guest-guard.ts`

## Backend Environment Variables

Defined in `backend/main.go` with defaults:

- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `5432`)
- `DB_USER` (default: `postgres`)
- `DB_PASSWORD` (default: empty)
- `DB_NAME` (default: `postgres`)
- `JWT_KEY` (**required**, min 32 chars)
- `CORS_ALLOWED_ORIGINS` (default: `http://localhost:4200,http://127.0.0.1:4200`)

## Recommended Setup

Use:

- `backend/.env.example` as template
- create `backend/.env` for local development

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=kmubinder
JWT_KEY=replace-with-at-least-32-characters
CORS_ALLOWED_ORIGINS=http://localhost:4200,http://127.0.0.1:4200
```

## Why These Changes

- Avoid brittle hardcoded URLs across frontend files
- Ensure production-safe JWT configuration
- Allow local host variants (`localhost`, `127.0.0.1`) without code edits
- Keep API host/origin changes environment-driven
