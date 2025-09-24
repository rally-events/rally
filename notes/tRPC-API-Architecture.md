# Rally tRPC API Architecture Guide

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Package Structure](#package-structure)
3. [Authentication System](#authentication-system)
4. [Type Inference Flow](#type-inference-flow)
5. [Creating New Routes - Step by Step](#creating-new-routes---step-by-step)
6. [Client Usage Patterns](#client-usage-patterns)
7. [Advanced Topics](#advanced-topics)
8. [Troubleshooting](#troubleshooting)

## Architecture Overview

The Rally API system is built on tRPC (TypeScript Remote Procedure Call) which provides end-to-end type safety from your database to your frontend applications. Here's how the pieces fit together:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │     Next.js     │    │   Future Apps   │
│       App       │    │    Web App      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ @rally/api-client│
                    │  (Shared Types) │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   @rally/api    │
                    │ (tRPC Server)   │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   @rally/db     │
                    │ (Database ORM)  │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   (Supabase)    │
                    └─────────────────┘
```

## Package Structure

### @rally/api (Core Server Package)

```
packages/api/
├── src/
│   ├── context.ts           # Request context with Supabase auth
│   ├── trpc.ts             # Core tRPC setup and procedures
│   ├── router/
│   │   ├── index.ts        # Root router combining all routes
│   │   └── user.ts         # User-related routes
│   └── index.ts            # Package exports
├── package.json
└── tsconfig.json
```

**Key Responsibilities:**
- Defines all API procedures (routes)
- Handles authentication middleware
- Manages database connections
- Exports type definitions

### @rally/api-client (Shared Client Package)

```
packages/api-client/
├── src/
│   └── index.ts            # Client utilities and type exports
├── package.json
└── tsconfig.json
```

**Key Responsibilities:**
- Provides client factory functions
- Re-exports inferred types
- Shared configuration for all client apps

### Next.js Integration

```
next/src/
├── app/api/trpc/[trpc]/
│   └── route.ts            # HTTP handler for tRPC requests
├── lib/trpc/
│   ├── client.ts           # Client-side tRPC setup
│   ├── server.ts           # Server-side tRPC caller
│   └── provider.tsx        # React provider component
├── providers/
│   └── index.tsx           # Root provider wrapper
└── components/examples/
    ├── ClientUserInfo.tsx  # Client component example
    └── ServerUserInfo.tsx  # Server component example
```

### React Native Integration

```
mobile/src/
├── lib/
│   ├── auth.ts             # Supabase client with secure storage
│   └── api.ts              # tRPC client configuration
├── providers/
│   └── TRPCProvider.tsx    # React Query + tRPC provider
└── components/
    └── UserInfo.tsx        # Example component
```

## Authentication System

The API uses a three-tier authentication system:

### 1. Public Procedures
```typescript
export const publicProcedure = t.procedure
```
- No authentication required
- Available to all users
- Use for: login endpoints, public content, health checks

### 2. Protected Procedures
```typescript
export const protectedProcedure = publicProcedure.use(isAuthenticated)
```
- Requires valid Supabase session
- User object guaranteed in context
- Use for: user data, private content, user actions

### 3. Admin Procedures
```typescript
export const adminProcedure = publicProcedure.use(isAdmin)
```
- Requires valid session AND admin role
- Checks `user_metadata.role === "admin"`
- Use for: admin panels, system management, user management

### Authentication Flow

1. **Next.js (Cookie-based)**:
   ```typescript
   // Middleware extracts cookies from request
   const cookieStore = await cookies()
   const supabase = createServerClient(url, key, { cookies: ... })
   const { data: { user } } = await supabase.auth.getUser()
   ```

2. **React Native (Header-based)**:
   ```typescript
   // Client sends auth headers
   headers: {
     Authorization: `Bearer ${session.access_token}`,
     Cookie: `sb-access-token=${session.access_token}; sb-refresh-token=${session.refresh_token}`
   }
   ```

## Type Inference Flow

The magic of this system is complete type inference:

```
Database Schema (Drizzle)
    ↓
tRPC Procedures
    ↓
Router Definition
    ↓ (automatic inference)
Client Types
    ↓
IDE Autocomplete
```

**No manual type definitions needed!** Types flow automatically from your database schema through to your frontend code.

## Creating New Routes - Step by Step

Let's create a complete example: a "posts" feature with CRUD operations.

### Step 1: Update Database Schema (if needed)

First, add the schema in `packages/db/src/schema/`:

```typescript
// packages/db/src/schema/posts-schema.ts
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"
import { usersTable } from "./user-schema"

export const postsTable = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: uuid("author_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
```

Export it in `packages/db/src/schema.ts`:
```typescript
export * from "./schema/user-schema"
export * from "./schema/posts-schema"  // Add this line
```

### Step 2: Create the Router

Create `packages/api/src/router/posts.ts`:

```typescript
import { z } from "zod"
import { db, postsTable, eq, desc } from "@rally/db"
import { router, publicProcedure, protectedProcedure } from "../trpc"

export const postsRouter = router({
  // Public: Get all posts
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const posts = await db.query.postsTable.findMany({
        limit: input.limit,
        offset: input.offset,
        orderBy: desc(postsTable.createdAt),
        with: {
          // Join with author data if you have relations set up
        },
      })
      return posts
    }),

  // Public: Get single post
  getById: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .query(async ({ input }) => {
      const post = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, input.id),
      })

      if (!post) {
        throw new Error("Post not found")
      }

      return post
    }),

  // Protected: Create post (requires auth)
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      content: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // ctx.user is guaranteed to exist here
      const [newPost] = await db.insert(postsTable).values({
        title: input.title,
        content: input.content,
        authorId: ctx.user.id,
      }).returning()

      return newPost
    }),

  // Protected: Update own post
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      title: z.string().min(1).max(200).optional(),
      content: z.string().min(1).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // First verify the user owns this post
      const existingPost = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, input.id),
      })

      if (!existingPost) {
        throw new Error("Post not found")
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new Error("You can only edit your own posts")
      }

      const [updatedPost] = await db
        .update(postsTable)
        .set({
          ...(input.title && { title: input.title }),
          ...(input.content && { content: input.content }),
          updatedAt: new Date(),
        })
        .where(eq(postsTable.id, input.id))
        .returning()

      return updatedPost
    }),

  // Protected: Delete own post
  delete: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const existingPost = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, input.id),
      })

      if (!existingPost) {
        throw new Error("Post not found")
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new Error("You can only delete your own posts")
      }

      await db.delete(postsTable).where(eq(postsTable.id, input.id))

      return { success: true }
    }),

  // Protected: Get user's own posts
  getMine: protectedProcedure
    .query(async ({ ctx }) => {
      const posts = await db.query.postsTable.findMany({
        where: eq(postsTable.authorId, ctx.user.id),
        orderBy: desc(postsTable.createdAt),
      })

      return posts
    }),
})
```

### Step 3: Add to Root Router

Update `packages/api/src/router/index.ts`:

```typescript
import { router } from "../trpc"
import { userRouter } from "./user"
import { postsRouter } from "./posts"  // Add this import

export const appRouter = router({
  user: userRouter,
  posts: postsRouter,  // Add this line
})

export type AppRouter = typeof appRouter
```

### Step 4: Rebuild API Package

```bash
cd packages/api && pnpm build
```

**That's it for the server!** The types are now automatically available to all clients.

### Step 5: Use in Next.js Server Components

```typescript
// app/posts/page.tsx
import { api } from "@/lib/trpc/server"

export default async function PostsPage() {
  const caller = await api()
  const posts = await caller.posts.getAll({ limit: 20 })

  return (
    <div>
      <h1>All Posts</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <small>Created: {post.createdAt.toDateString()}</small>
        </article>
      ))}
    </div>
  )
}
```

### Step 6: Use in Next.js Client Components

```typescript
// components/CreatePostForm.tsx
"use client"

import { useState } from "react"
import { trpc } from "@/lib/trpc/provider"

export default function CreatePostForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const utils = trpc.useUtils()
  const createPost = trpc.posts.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch posts
      utils.posts.getAll.invalidate()
      setTitle("")
      setContent("")
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      createPost.mutate({ title, content })
    }}>
      <div>
        <label>Title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={createPost.isPending}>
        {createPost.isPending ? "Creating..." : "Create Post"}
      </button>
      {createPost.error && (
        <p style={{ color: "red" }}>{createPost.error.message}</p>
      )}
    </form>
  )
}
```

### Step 7: Use in React Native

```typescript
// mobile/src/components/PostsList.tsx
import React from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { api } from '../lib/api'

export default function PostsList() {
  const { data: posts, isLoading, error, refetch } = api.posts.getAll.useQuery({
    limit: 50
  })

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading posts...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error.message}</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={styles.retry}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.postCard}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.content}>{item.content}</Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postCard: {
    padding: 16,
    margin: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  retry: {
    color: 'blue',
    fontSize: 16,
  },
})
```

## Client Usage Patterns

### Next.js Patterns

#### Server Components (Direct API Calls)
```typescript
const caller = await api()
const data = await caller.some.route()
```

#### Client Components (React Query Hooks)
```typescript
// Queries
const { data, isLoading, error } = trpc.posts.getAll.useQuery()

// Mutations
const createPost = trpc.posts.create.useMutation()

// Utils (for invalidation, prefetching, etc.)
const utils = trpc.useUtils()
utils.posts.getAll.invalidate()
```

### React Native Patterns

#### Queries
```typescript
const { data: posts, isLoading, error, refetch } = api.posts.getAll.useQuery({
  limit: 20
}, {
  // React Query options
  staleTime: 5 * 60 * 1000, // 5 minutes
  retry: 3,
})
```

#### Mutations
```typescript
const createPost = api.posts.create.useMutation({
  onSuccess: (data) => {
    // Handle success
    console.log('Created post:', data)
  },
  onError: (error) => {
    // Handle error
    Alert.alert('Error', error.message)
  },
})

// Usage
createPost.mutate({ title: 'My Post', content: 'Content here' })
```

#### Background Queries
```typescript
// Prefetch data
const utils = api.useUtils()
await utils.posts.getAll.prefetch({ limit: 10 })

// Invalidate cache
utils.posts.getAll.invalidate()

// Set query data
utils.posts.getById.setData({ id: 'some-id' }, updatedPost)
```

## Advanced Topics

### Input Validation with Zod

Always validate inputs using Zod schemas:

```typescript
.input(z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120),
  role: z.enum(['user', 'admin']),
  metadata: z.object({
    preferences: z.array(z.string()),
  }).optional(),
}))
```

### Error Handling

tRPC provides structured error handling:

```typescript
import { TRPCError } from "@trpc/server"

// In your procedure
if (!user) {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: 'User not found',
    cause: someOriginalError, // optional
  })
}

// Available codes:
// - UNAUTHORIZED
// - FORBIDDEN
// - NOT_FOUND
// - METHOD_NOT_SUPPORTED
// - TIMEOUT
// - CONFLICT
// - PRECONDITION_FAILED
// - PAYLOAD_TOO_LARGE
// - UNPROCESSABLE_CONTENT
// - TOO_MANY_REQUESTS
// - CLIENT_CLOSED_REQUEST
// - INTERNAL_SERVER_ERROR
```

### Database Transactions

For complex operations, use database transactions:

```typescript
create: protectedProcedure
  .input(postSchema)
  .mutation(async ({ ctx, input }) => {
    return await db.transaction(async (tx) => {
      // All operations in this block are atomic
      const [post] = await tx.insert(postsTable).values({
        ...input,
        authorId: ctx.user.id,
      }).returning()

      // Update user's post count
      await tx.update(usersTable)
        .set({ postCount: sql`post_count + 1` })
        .where(eq(usersTable.id, ctx.user.id))

      return post
    })
  })
```

### Pagination

Implement cursor-based pagination:

```typescript
getAll: publicProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).default(50),
    cursor: z.string().optional(), // cursor is the ID of the last item
  }))
  .query(async ({ input }) => {
    const items = await db.query.postsTable.findMany({
      limit: input.limit + 1, // Fetch one extra to know if there's more
      where: input.cursor
        ? lt(postsTable.createdAt, input.cursor)
        : undefined,
      orderBy: desc(postsTable.createdAt),
    })

    let nextCursor: string | undefined = undefined
    if (items.length > input.limit) {
      const nextItem = items.pop() // Remove the extra item
      nextCursor = nextItem!.createdAt.toISOString()
    }

    return {
      items,
      nextCursor,
    }
  })
```

Use with infinite queries:

```typescript
// In React/React Native
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = trpc.posts.getAll.useInfiniteQuery(
  { limit: 20 },
  {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  }
)
```

### File Uploads

For file uploads, create separate endpoints or use a service like Supabase Storage:

```typescript
uploadImage: protectedProcedure
  .input(z.object({
    fileName: z.string(),
    fileType: z.string(),
    fileSize: z.number().max(5 * 1024 * 1024), // 5MB max
  }))
  .mutation(async ({ ctx, input }) => {
    // Generate signed URL for direct upload to Supabase Storage
    const { data, error } = await ctx.supabase.storage
      .from('post-images')
      .createSignedUploadUrl(`${ctx.user.id}/${input.fileName}`)

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to generate upload URL',
      })
    }

    return {
      uploadUrl: data.signedUrl,
      path: data.path,
    }
  })
```

## Troubleshooting

### Common Issues

#### 1. "Cannot find module '@rally/api'"
```bash
# Make sure packages are built
cd packages/api && pnpm build
cd packages/api-client && pnpm build
```

#### 2. "tRPC client not configured"
Check that providers are properly set up in your app root:

```typescript
// Next.js: app/layout.tsx
<Providers>{children}</Providers>

// React Native: App.tsx
<TRPCProvider>{children}</TRPCProvider>
```

#### 3. Authentication not working
- Verify environment variables are set
- Check that cookies/headers are being passed correctly
- Ensure Supabase session is valid

#### 4. Types not updating
```bash
# Rebuild API package
cd packages/api && pnpm build

# Restart TypeScript server in your IDE
# VS Code: Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

### Development Tips

1. **Use the tRPC Panel** (optional dev tool):
   ```bash
   pnpm add @trpc/panel
   ```

2. **Enable request logging**:
   ```typescript
   // In your API route handler
   onError: ({ error, path, input }) => {
     console.error(`tRPC Error on ${path}:`, error)
     console.log('Input:', input)
   },
   ```

3. **Type-check regularly**:
   ```bash
   pnpm type-check
   ```

4. **Use React Query Devtools**:
   ```bash
   pnpm add @tanstack/react-query-devtools
   ```

### Performance Considerations

1. **Batch requests** - tRPC automatically batches requests made at the same time
2. **Use appropriate staleTime** for caching
3. **Implement proper pagination** for large datasets
4. **Use database indexes** for frequently queried fields
5. **Consider edge caching** for public endpoints

This architecture provides a robust, type-safe foundation that scales from small features to large applications while maintaining excellent developer experience across all platforms.