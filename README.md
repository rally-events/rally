# Rally

A modern event management platform built with Next.js, Express, and Drizzle ORM.

## Project Structure

This is a monorepo containing:

- **`frontend/`** - Next.js application with React and TypeScript
- **`backend/`** - Express.js API server
- **`packages/db/`** - Shared database package with Drizzle ORM and Supabase

## Quick Start

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   - Copy `.env.example` files in each package and configure with your values
   - You'll need a Supabase project and database URL

3. **Database setup:**

   ```bash
   cd packages/db
   cp .env.example .env
   # Edit .env with your Supabase credentials
   pnpm db:push  # Push schema to your database
   ```

4. **Run the development servers:**

   ```bash
   # Terminal 1 - Frontend (runs on http://localhost:3000)
   cd frontend
   pnpm dev

   # Terminal 2 - Backend API (runs on http://localhost:3001)
   cd backend
   pnpm dev
   ```

## Development Workflow

### Database Changes

- Edit schema files in `packages/db/src/schema/`
- Run `pnpm db:generate` to generate migrations
- Run `pnpm db:push` to apply changes to your database
- Use `pnpm db:studio` to open Drizzle Studio for database management

### API Development

- Add routes in `backend/src/routes/`
- The backend automatically imports the shared database package
- Health check available at `/api/health`

### Frontend Development

- Built with Next.js 14, React, and TypeScript
- Uses shadcn/ui components
- Can consume the backend API at `http://localhost:3001`

## Environment Variables

Each package has its own `.env.example` file. Make sure to configure:

- **Database**: Supabase connection details
- **Backend**: API configuration and database URL
- **Frontend**: API URLs and any client-side config

## Commands

From the root directory:

- `pnpm install` - Install all dependencies
- `pnpm --filter backend dev` - Run backend only
- `pnpm --filter frontend dev` - Run frontend only
- `pnpm --filter @rally/db build` - Build database package
