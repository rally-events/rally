import { api } from "@/lib/trpc/server"
import React, { Suspense } from "react"
import TopNavSearch from "./top-nav-search"
import TopNavUser from "./top-nav-user"
import TopNavNotifications from "./top-nav-notifications"
import { Skeleton } from "@/components/ui/skeleton"

// is same height as the logo part of side nav (in tailwind units)
// 8 + (2 + 2) + (2 + 2) = 16
// logoHeight + logoButtonPadding + logoButtonMargin

export default function DesktopTopHeader() {
  return (
    <div className="bg-surface fixed top-0 left-0 flex h-16 w-full items-center justify-between border-b pr-4 pl-76">
      <TopNavSearch />
      <Suspense fallback={<DesktopTopHeaderUserSkeleton />}>
        <DesktopTopHeaderUser />
      </Suspense>
    </div>
  )
}

const DesktopTopHeaderUser = async () => {
  const caller = await api()
  const user = await caller.user.getUserInfo()
  if (!user) {
    return <DesktopTopHeaderUserSkeleton />
  }
  return (
    <div className="flex items-center gap-2">
      <TopNavNotifications />
      <TopNavUser user={user} />
    </div>
  )
}

const DesktopTopHeaderUserSkeleton = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 w-10" />
      <Skeleton className="h-10 w-52" />
    </div>
  )
}
