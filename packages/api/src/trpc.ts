import { initTRPC, TRPCError } from "@trpc/server"
import { type Context } from "./context"

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape
  },
})

// Base router and procedures
export const router = t.router
export const middleware = t.middleware

// Public procedure - no authentication required
export const publicProcedure = t.procedure

// Auth middleware that checks for authenticated user
const isAuthenticated = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // User is guaranteed to exist here
    },
  })
})

// Admin middleware that checks for admin role
const isAdmin = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    })
  }

  // Check if user has admin role in metadata
  const isAdminUser = ctx.user.user_metadata?.is_admin === true
  if (!isAdminUser) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You must be an admin to access this resource",
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

// Protected procedure - requires authentication
export const protectedProcedure = publicProcedure.use(isAuthenticated)

// Admin procedure - requires admin role
export const adminProcedure = publicProcedure.use(isAdmin)
