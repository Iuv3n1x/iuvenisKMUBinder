# Testing and Quality

## Frontend

Run tests:

- `npm test`

Run production build check:

- `npm run build`

## Backend

Expected command (when Go is installed):

- `cd backend`
- `go test ./...`

At the time of setup on this machine, Go was not installed, so backend tests were not executable yet.

## Security and Stability Notes

- Passwords are hashed using bcrypt before storage.
- JWT secret should be changed from default in all non-local environments.
- API currently has a TODO note for login rate limiting in `backend/main.go`.
