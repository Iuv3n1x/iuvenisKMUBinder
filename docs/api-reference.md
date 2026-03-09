# API Reference

Base URL (local): `http://localhost:8080`

## POST /users

Creates a new user and initializes earnings metadata.

### Request Body

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "passwordhash": "P@ssw0rd!",
  "registrationdate": "2026-03-09T10:00:00Z",
  "birthdate": "2000-01-01T00:00:00Z"
}
```

### Responses

- `201 Created`:
  - `{"message":"User added!"}`
- `400 Bad Request`:
  - Invalid JSON payload
- `500 Internal Server Error`:
  - DB or insert error (for example duplicate email)

## POST /login

Authenticates user and sets auth cookie.

### Request Body

```json
{
  "email": "john@example.com",
  "password": "P@ssw0rd!",
  "stayLogged": true
}
```

### Responses

- Success:
  - `{"success": true}` + `Set-Cookie: token=...`
- Invalid credentials:
  - `{"success": false}`
- Server error:
  - `500 Internal Server Error`

## GET /auth/check

Checks whether the JWT cookie is valid.

### Responses

- `200 OK`: authenticated
- `401 Unauthorized`: missing/invalid/expired token
