import { api } from "@/lib/trpc/server"
import React, { Suspense } from "react"
import TopNavSearch from "./top-nav-search"
import TopNavUser from "./top-nav-user"
import TopNavNotifications from "./notifications/top-nav-notifications"
import { Skeleton } from "@/components/ui/skeleton"
import TopNavBreadcrumb from "./breadcrumbs/top-nav-breadcrumb"
import NAV_CONFIG from "../../nav-config"

// is same height as the logo part of side nav (in tailwind units)
// 8 + (2 + 2) + (2 + 2) = 16
// logoHeight + logoButtonPadding + logoButtonMargin

export default function DesktopTopHeader() {
  return (
    <div
      className={`bg-surface fixed left-0 flex items-center justify-between ${NAV_CONFIG.left.padding} ${NAV_CONFIG.top.height} w-full border-b pr-4`}
    >
      <div className="flex items-center gap-3">
        <TopNavSearch />
        <div className="bg-border h-6 w-px" />
        <TopNavBreadcrumb />
      </div>
      <Suspense fallback={<DesktopTopHeaderUserSkeleton />}>
        <DesktopTopHeaderUser />
      </Suspense>
    </div>
  )
}

const DesktopTopHeaderUser = async () => {
  const caller = await api()
  const user = await caller.user.getUserInfo({ withNotifications: true })
  if (!user) {
    return <DesktopTopHeaderUserSkeleton />
  }
  return (
    <div className="flex items-center gap-2">
      <TopNavNotifications user={user} initialNotifications={user.notifications} />
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
