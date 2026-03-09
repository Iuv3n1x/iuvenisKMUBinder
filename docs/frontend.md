# Frontend Documentation (Angular)

## Stack

- Angular CLI `21.1.x`
- TypeScript `5.9.x`
- SCSS styles
- Router-based navigation

## Entry Points

- `src/main.ts`: bootstraps Angular app using `bootstrapApplication`
- `src/app/app.ts`: root component
- `src/app/app.config.ts`: app providers (router + global error listeners)
- `src/app/app.routes.ts`: route definitions and guards

## Routes

- `/dashboard`: protected by `authGuard`
- `/login`: protected by `guestGuard`, renders unified auth page in login mode
- `/signup`: protected by `guestGuard`, renders unified auth page in signup mode
- `/`: redirects to `/dashboard`
- `**`: 404 page

## Components

- `Dashboard`: post-login landing area
- `Login`: unified auth component (login + signup in one split layout)
- `Navbar`: reusable dashboard navigation component
- `PageNotFound`: fallback route component

## Unified Auth UI

The auth screen is implemented in `src/app/components/login/*` and includes:

- Desktop split-panel layout:
  - Left panel: website/brand section with details
  - Right panel: form card
- Mode toggle:
  - Login mode and signup mode share the same layout
  - Bottom switch text toggles mode and route (`/login` <-> `/signup`)
- Color themes by mode:
  - Login: blue accent/background
  - Signup: orange accent/background
- Responsive behavior:
  - Mobile stacks panels vertically
  - Brand/info panel uses mobile-only parallax-style background effect
  - Form remains readable and full-width on small screens

## Services and Models

- `UserService` (`src/app/services/user-service.ts`)
  - `signUp(user)` -> `POST /users`
  - `login(userLog, stayLogged)` -> `POST /login` with `withCredentials`
  - `validateSignUp(...)` performs client-side validation
- Models (`src/app/models/user.model.ts`)
  - `User`
  - `UserLog`

## Guards

- `authGuard`:
  - Calls `GET /auth/check`
  - Redirects to `/login` if unauthorized
- `guestGuard`:
  - Allows access only when user is not authenticated
  - Redirects authenticated users to `/dashboard`

## Frontend Commands

- `npm start` -> dev server
- `npm run build` -> production build to `dist/kmuBinder`
- `npm test` -> unit tests (Angular unit test builder / Vitest setup in project)
