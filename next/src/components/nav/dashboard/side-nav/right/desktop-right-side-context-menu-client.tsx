"use client"
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { UserInfo } from "@rally/api"
import { usePathname } from "next/navigation"
import React from "react"

export default function DesktopRightSideContextMenuClient({
  user,
}: {
  user: UserInfo<{ withOrganization: true }>
}) {
  const path = usePathname()
  return (
    <div className="sticky top-20 flex flex-col gap-2">
      <Card>
        <CardHeader>
          <CardTitle>Your organization: {user.organization?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your route: {path}</p>
        </CardContent>
      </Card>
    </div>
  )
}
