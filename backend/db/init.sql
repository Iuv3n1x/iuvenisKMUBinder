CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordhash TEXT NOT NULL,
    registrationdate TIMESTAMP NOT NULL,
    birthdate DATE NOT NULL,
    is_user BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS earnings (
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    streak INTEGER NOT NULL DEFAULT 0,
    higheststreak INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS businesses (
    id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    businessname TEXT NOT NULL,
    startercode TEXT,
    qr TEXT,
    qrtokenexpiry TIMESTAMP,
    streaktimer INTEGER NOT NULL DEFAULT 1
);
