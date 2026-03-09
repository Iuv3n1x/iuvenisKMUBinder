# Backend Documentation (Go)

## Stack

- Go service (`backend/main.go`)
- PostgreSQL driver: `github.com/lib/pq`
- Password hashing: `golang.org/x/crypto/bcrypt`
- JWT: `github.com/golang-jwt/jwt/v5`
- Env loading: `github.com/joho/godotenv`

## Runtime Behavior

- Loads `.env` from `backend/.env` when available
- Falls back to default environment values when variables are missing
- Connects to PostgreSQL at startup and fails fast on connection errors
- Exposes HTTP endpoints on `:8080`

## CORS

Configured in `cors(...)` middleware:

- Allowed origin: `http://localhost:4200`
- Methods: `POST, GET, OPTIONS, PUT, DELETE`
- Headers: `Content-Type`
- Credentials: enabled

## Auth

- Login issues JWT cookie:
  - Cookie name: `token`
  - `HttpOnly: true`
  - `SameSite: Lax`
  - `Secure: false` (dev mode)
- Token expiry:
  - `stayLogged = true` -> 30 days
  - otherwise -> 24 hours

## Endpoints

- `POST /users`: register user
- `POST /login`: authenticate and set cookie
- `GET /auth/check`: validate cookie token

## Backend Command

From `backend/`:

- `go run .`
