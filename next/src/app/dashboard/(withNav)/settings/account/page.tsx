import AccountSettings from "@/components/settings/account/account-settings"
import { api } from "@/lib/trpc/server"
import React from "react"

export default async function page() {
  const caller = await api()
  const user = await caller.user.getUserInfo({ withChallenges: true })
  if (!user) {
    return null
  }
  return <AccountSettings user={user} />
}
