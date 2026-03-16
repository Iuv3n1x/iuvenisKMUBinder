# Backend Documentation (Go)

## Stack

- Go service (`backend/main.go`)
- PostgreSQL driver: `github.com/lib/pq`
- Password hashing: `golang.org/x/crypto/bcrypt`
- JWT: `github.com/golang-jwt/jwt/v5`
- Env loading: `github.com/joho/godotenv`

## Runtime Behavior

- Loads `.env` from `backend/.env` when available
- Uses required environment values for security-sensitive config
- Connects to PostgreSQL at startup and fails fast on connection errors
- Exposes HTTP endpoints on `:8080`

## CORS

Configured in `cors(...)` middleware:

- Allowed origins are loaded from `CORS_ALLOWED_ORIGINS` (comma-separated)
- Defaults include:
  - `http://localhost:4200`
  - `http://127.0.0.1:4200`
- Methods: `POST, GET, OPTIONS, PUT, DELETE`
- Headers: `Content-Type, Authorization`
- Credentials: enabled

## Auth

- Login issues JWT cookie:
  - Cookie name: `token`
  - `HttpOnly: true`
  - `SameSite: Lax`
  - `Secure: false` (dev mode)
- `JWT_KEY` is mandatory and must be at least 32 characters
- Token expiry:
  - `stayLogged = true` -> 30 days
  - otherwise -> 24 hours

## Endpoints

- `POST /users`: register user
- `POST /login`: authenticate and set cookie
- `GET /auth/check`: validate cookie token
- `POST /logout`: clear auth cookie
- `POST /initAdmin`: initialize an admin user and a business record

## Admin Initialization Contract

`POST /initAdmin` expects:

- `firstname`
- `lastname`
- `companyName`
- `starterCode`
- `email`
- `passwordhash`
- `birthdate`
- `seriesLimit`

Behavior:

- Creates a row in `users` with `is_user = false`
- Creates a row in `businesses` linked to that user id

## Backend Command

From `backend/`:

- `go run .`
