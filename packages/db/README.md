# Rally Database Package

Shared database package using Drizzle ORM with Supabase for the Rally platform.

## Features

- **Drizzle ORM** for type-safe database operations
- **Supabase** as the PostgreSQL database provider
- **Zod schemas** for runtime validation
- **TypeScript** for full type safety
- **Database migrations** and schema management

## Setup

1. **Environment configuration**:

   ```bash
   cp .env.example .env
   # Add your Supabase credentials
   ```

2. **Push schema to database**:
   ```bash
   pnpm db:push
   ```

## Schema

The database includes these main tables:

### Users

- Basic user information (email, name, role)
- Support for hosts, sponsors, and regular users
- Profile data stored as JSON

### Events

- Event details (title, description, dates)
- Host relationship to users
- Attendance tracking
- Event status management

## Usage

```typescript
import { db, users, events } from "@rally/db"

// Query users
const allUsers = await db.select().from(users)

// Create a new event
const newEvent = await db.insert(events).values({
  title: "My Event",
  hostId: "user-uuid",
  startDate: new Date(),
  endDate: new Date(),
})
```

## Scripts

- `pnpm db:generate` - Generate migration files
- `pnpm db:migrate` - Run migrations
- `pnpm db:push` - Push schema changes directly
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm build` - Build the package

## Environment Variables

| Variable                    | Description                                |
| --------------------------- | ------------------------------------------ |
| `DATABASE_URL`              | Full Supabase PostgreSQL connection string |
| `SUPABASE_URL`              | Your Supabase project URL                  |
| `SUPABASE_ANON_KEY`         | Supabase anonymous key                     |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key                  |

## Schema Management

1. **Making changes**: Edit files in `src/schema/`
2. **Generate migrations**: `pnpm db:generate`
3. **Apply changes**: `pnpm db:push` or `pnpm db:migrate`
4. **View database**: `pnpm db:studio`

The schema is automatically exported and can be imported by other packages in the monorepo.
