import { router } from "../trpc"
import { userRouter } from "./user-router"
import { addressRouter } from "./address-router"
import { organizationRouter } from "./organization-router"

export const appRouter = router({
  user: userRouter,
  address: addressRouter,
  organization: organizationRouter,
})

export type AppRouter = typeof appRouter
