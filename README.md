# KmuBinder

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Implementation Notes

- Full audit and fix report: `docs/2026-03-16-audit-fixes.md`
- Backend behavior/config: `docs/backend.md`
- DB schema details: `docs/database.md`
- Env/config details: `docs/configuration.md`

## Backend Quick Start (Go + PostgreSQL)

The backend lives in `backend/` and expects PostgreSQL plus a small `.env` file.

1. Copy `backend/.env.example` to `backend/.env` and update values if needed.
   `JWT_KEY` must be at least 32 characters.
2. Create the database from your PostgreSQL shell:

```sql
CREATE DATABASE kmubinder;
```

3. Run the schema:

```bash
psql -U postgres -d kmubinder -f backend/db/init.sql
```

4. Start backend:

```bash
cd backend
go run .
```

The backend serves on `http://localhost:8080` and is configured for frontend CORS from `http://localhost:4200`.
To allow additional frontend origins, set `CORS_ALLOWED_ORIGINS` as a comma-separated list in `backend/.env`.
