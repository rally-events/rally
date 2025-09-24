# Rally API Usage Guide

This guide demonstrates how to use the new unified, type-safe tRPC API across your Next.js and React Native applications.

## Overview

The API system consists of:
- `@rally/api`: Core tRPC server with authentication middleware
- `@rally/api-client`: Shared client utilities for both platforms
- Automatic type inference throughout the stack
- Supabase authentication integration

## Authentication Levels

### Public Routes
No authentication required.

### Protected Routes
User must be authenticated (logged in via Supabase).

### Admin Routes
User must be authenticated AND have admin role in user_metadata.

## Usage Examples

### Next.js Server Components

```typescript
import { api } from "@/lib/trpc/server"

export default async function MyServerComponent() {
  try {
    const caller = await api()
    const user = await caller.user.getUserInfo()

    return <div>Welcome {user.firstName}!</div>
  } catch (error) {
    return <div>Please log in to continue</div>
  }
}
```

### Next.js Client Components

```typescript
"use client"

import { trpc } from "@/lib/trpc/provider"

export default function MyClientComponent() {
  const { data: user, isLoading, error } = trpc.user.getUserInfo.useQuery()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>Please log in</div>

  return <div>Welcome {user.firstName}!</div>
}
```

### React Native

```typescript
import { api } from '../lib/api'

export default function MyComponent() {
  const { data: user, isLoading, error } = api.user.getUserInfo.useQuery()

  if (isLoading) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error.message}</Text>
  if (!user) return <Text>Please log in</Text>

  return <Text>Welcome {user.firstName}!</Text>
}
```

## Type Safety

All types are automatically inferred. You get:
- Full autocompletion in your IDE
- Type errors at compile time
- Automatic type synchronization across all platforms

## Adding New Routes

1. Create a new router in `packages/api/src/router/`
2. Add it to the root router in `packages/api/src/router/index.ts`
3. Use the appropriate procedure type:
   - `publicProcedure` for public routes
   - `protectedProcedure` for authenticated routes
   - `adminProcedure` for admin-only routes

Example:

```typescript
export const exampleRouter = router({
  getPublicData: publicProcedure.query(() => {
    return { message: "This is public" }
  }),

  getPrivateData: protectedProcedure.query(({ ctx }) => {
    // ctx.user is guaranteed to exist here
    return { message: `Hello ${ctx.user.email}` }
  }),

  adminOnlyAction: adminProcedure.input(z.object({
    action: z.string()
  })).mutation(({ ctx, input }) => {
    // ctx.user is guaranteed to be admin here
    return { success: true }
  })
})
```

## Environment Setup

### Next.js
Your existing `.env.local` should work. Make sure you have:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### React Native
Create a `.env` file in the `mobile/` directory:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_API_URL` (your Next.js app URL + /api/trpc)

## Development

For local development with React Native:
1. Find your computer's IP address (`ipconfig` on Windows, `ifconfig` on Mac/Linux)
2. Update the API URL in `mobile/src/lib/api.ts` to use your IP address
3. Make sure your Next.js app is running on the same network

Example: `http://192.168.1.100:3000/api/trpc`