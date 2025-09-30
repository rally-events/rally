import { api } from "@/lib/trpc/server"
import React from "react"
import TopNavSearch from "./top-nav-search"
import TopNavUser from "./top-nav-user"

// is same height as the logo part of side nav (in tailwind units)
// 8 + (2 + 2) + (2 + 2) = 16
// logoHeight + logoButtonPadding + logoButtonMargin

export default function DesktopTopHeader() {
  return (
    <div className="bg-surface fixed top-0 left-0 flex h-16 w-full items-center justify-between border-b pr-4 pl-76">
      <TopNavSearch />
      <DesktopTopHeaderUser />
    </div>
  )
}

const DesktopTopHeaderUser = async () => {
  const caller = await api()
  const user = await caller.user.getUserInfo()
  if (!user) {
    return <div>Loading...</div>
  }
  return <TopNavUser user={user} />
}
