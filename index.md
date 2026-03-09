# iuvenisKMUBinder Documentation Index

This file is the top-level index for the project documentation.

## Documentation Map

- [Project Overview](./docs/project-overview.md)
- [Frontend Documentation (Angular)](./docs/frontend.md)
- [Backend Documentation (Go)](./docs/backend.md)
- [API Reference](./docs/api-reference.md)
- [Database Schema](./docs/database.md)
- [Environment and Configuration](./docs/configuration.md)
- [Development Workflow](./docs/development-workflow.md)
- [Testing and Quality](./docs/testing.md)
- [Troubleshooting](./docs/troubleshooting.md)

## Quick Start

1. Install frontend dependencies:
   - `npm ci`
2. Configure backend environment:
   - Copy `backend/.env.example` to `backend/.env`
3. Create and initialize PostgreSQL database:
   - `CREATE DATABASE kmubinder;`
   - `psql -U postgres -d kmubinder -f backend/db/init.sql`
4. Start frontend:
   - `npm start`
5. Start backend:
   - `cd backend`
   - `go run .`
