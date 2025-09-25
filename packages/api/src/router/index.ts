import { router } from "../trpc"
import { userRouter } from "./user-router"
import { addressRouter } from "./address-router"

export const appRouter = router({
  user: userRouter,
  address: addressRouter,
})

export type AppRouter = typeof appRouter
