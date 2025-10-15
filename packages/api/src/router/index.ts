import { router } from "../trpc"
import { userRouter } from "./user-router"
import { addressRouter } from "./address-router"
import { organizationRouter } from "./organization-router"
import { eventRouter } from "./event-router"
import { mediaRouter } from "./media-router"
import { sponsorshipRouter } from "./sponsorship-router"
import { notificationRouter } from "./notification-router"
import { authRouter } from "./auth-router"

export const appRouter = router({
  user: userRouter,
  address: addressRouter,
  organization: organizationRouter,
  event: eventRouter,
  media: mediaRouter,
  sponsorship: sponsorshipRouter,
  notification: notificationRouter,
  auth: authRouter,
})

export type AppRouter = typeof appRouter
