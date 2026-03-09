# Database Schema

The backend expects a PostgreSQL database with `users` and `earnings`.

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

## earnings

- `id SERIAL PRIMARY KEY`
- `userid INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE`
- `streak INTEGER NOT NULL DEFAULT 0`
- `higheststreak INTEGER NOT NULL DEFAULT 0`

## Notes

- Email uniqueness is enforced at DB level.
- Password is stored as bcrypt hash.
- A user automatically receives an `earnings` row on signup.
