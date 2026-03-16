# Database Schema

The backend expects a PostgreSQL database with `users`, `earnings`, and `businesses`.

## SQL Source of Truth

- `backend/db/init.sql`

## users

- `id SERIAL PRIMARY KEY`
- `firstname TEXT NOT NULL`
- `lastname TEXT NOT NULL`
- `email TEXT NOT NULL UNIQUE`
- `passwordhash TEXT NOT NULL`
- `registrationdate TIMESTAMP NOT NULL`
- `birthdate DATE NOT NULL`
- `is_user BOOLEAN NOT NULL DEFAULT true`

## earnings

- `id SERIAL PRIMARY KEY`
- `userid INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`
- `streak INTEGER NOT NULL DEFAULT 0`
- `higheststreak INTEGER NOT NULL DEFAULT 0`

## businesses

- `id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE`
- `businessname TEXT NOT NULL`
- `startercode TEXT`
- `qr TEXT`
- `qrtokenexpiry TIMESTAMP`
- `streaktimer INTEGER NOT NULL DEFAULT 1`

## Notes

- Email uniqueness is enforced at DB level.
- Password is stored as bcrypt hash.
- A user automatically receives an `earnings` row on signup.
- Admin initialization creates a `users` row (`is_user = false`) plus a linked `businesses` row.
