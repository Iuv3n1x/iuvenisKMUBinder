# Environment and Configuration

## Frontend

Frontend API URLs are hardcoded in `src/app/services/user-service.ts` and guards:

- Signup: `http://localhost:8080/users`
- Login: `http://localhost:8080/login`
- Auth check: `http://localhost:8080/auth/check`

If backend host/port changes, update those values.

## Backend Environment Variables

Defined in `backend/main.go` with defaults:

- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `5432`)
- `DB_USER` (default: `postgres`)
- `DB_PASSWORD` (default: empty)
- `DB_NAME` (default: `postgres`)
- `JWT_KEY` (default: `defaultsecret`)

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
JWT_KEY=change-me-to-a-long-random-secret
```
