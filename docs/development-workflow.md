# Development Workflow

## First-Time Setup

1. Clone repository.
2. Run `npm ci`.
3. Configure backend env:
   - Copy `backend/.env.example` -> `backend/.env`.
4. Create database:
   - `CREATE DATABASE kmubinder;`
5. Initialize tables:
   - `psql -U postgres -d kmubinder -f backend/db/init.sql`

## Daily Start

1. Start backend:
   - `cd backend`
   - `go run .`
2. Start frontend (separate terminal):
   - `npm start`
3. Open:
   - `http://localhost:4200`

## Build

- `npm run build`

## Version Control

- Keep backend env secrets in `backend/.env` (already ignored by git).
- Commit docs updates when behavior/API/schema changes.
