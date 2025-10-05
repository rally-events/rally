import { api } from "@/lib/trpc/server"
import React from "react"
import DesktopRightSideContextMenuClient from "./desktop-right-side-context-menu-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DesktopRightSideContextMenu() {
  const caller = await api()
  const user = await caller.user.getUserInfo({ withOrganization: true })
  if (!user) {
    return null
  }
  return <DesktopRightSideContextMenuClient user={user} />
}

export const DesktopRightSideContextMenuSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your route: Loading...</p>
        </CardContent>
      </Card>
    </div>
  )
}
