import { router } from "../trpc"
import { userRouter } from "./user-router"
import { addressRouter } from "./address-router"
import { organizationRouter } from "./organization-router"
import { eventRouter } from "./event-router"

export const appRouter = router({
  user: userRouter,
  address: addressRouter,
  organization: organizationRouter,
  event: eventRouter,
})

export type AppRouter = typeof appRouter
