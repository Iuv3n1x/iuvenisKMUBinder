# Project Overview

## What This Project Is

`iuvenisKMUBinder` is a full-stack authentication-focused web application with:

- Angular frontend (`src/`)
- Go backend (`backend/`)
- PostgreSQL database
- JWT-based cookie authentication

## High-Level Architecture

- Frontend runs on `http://localhost:4200`
- Backend runs on `http://localhost:8080`
- Backend validates credentials against PostgreSQL
- Backend sets an `HttpOnly` JWT cookie named `token`
- Frontend route guards call `/auth/check` to enforce access rules

## Main User Flows

- Sign up:
  - User opens unified auth page in signup mode
  - User submits profile + password
  - Frontend validates input
  - Backend hashes password and stores user
  - Backend initializes related `earnings` record
- Login:
  - User opens unified auth page in login mode
  - User submits email/password
  - Backend verifies hash and returns success
  - Backend sets auth cookie
  - Frontend redirects to dashboard
- Session check:
  - Guards call `/auth/check`
  - Valid cookie grants access to protected routes

## Repository Layout

- `src/`: Angular app source
- `public/`: static assets for frontend
- `backend/`: Go service, env config, SQL initialization
- `docs/`: full project documentation
