# Troubleshooting

## Frontend Cannot Reach Backend

Symptoms:

- Signup/login fails
- Guards always redirect to login

Checks:

- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:4200`
- Browser accepts cookies for local environment

## Unauthorized on /dashboard

Checks:

- Login request returns `{"success": true}`
- `token` cookie exists after login
- `JWT_KEY` has not changed between login and auth check

## Database Connection Fails

Checks:

- PostgreSQL service is running
- `backend/.env` values are correct
- Database exists (`kmubinder` if using default template)

## Signup Returns Server Error

Common causes:

- Duplicate email (unique constraint)
- Missing tables (run `backend/db/init.sql`)

## Go Command Not Found

Install Go and verify:

- `go version`

Then run backend:

- `cd backend`
- `go run .`
