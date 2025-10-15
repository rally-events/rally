"use client"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/utils/supabase/client"
import { BellIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { NotificationInfo, UserInfo } from "@rally/api"
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import NotificationItem from "./notification-item"

interface TopNavNotificationsProps {
  user: UserInfo
  initialNotifications: NotificationInfo[]
}

export default function TopNavNotifications({
  user,
  initialNotifications,
}: TopNavNotificationsProps) {
  const [notifications, setNotifications] = useState<NotificationInfo[]>(initialNotifications)
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to notifications for the user's organization
    const orgChannel = supabase
      .channel("notifications-org")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `organization_id=eq.${user.organizationId}`,
        },
        (payload: RealtimePostgresChangesPayload<NotificationInfo>) => {
          handleNotificationChange(payload)
        },
      )
      .subscribe()

    // Subscribe to notifications for the specific user
    const userChannel = supabase
      .channel("notifications-user")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<NotificationInfo>) => {
          handleNotificationChange(payload)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(orgChannel)
      supabase.removeChannel(userChannel)
    }
  }, [user.id, user.organizationId])

  const handleNotificationChange = (payload: RealtimePostgresChangesPayload<NotificationInfo>) => {
    if (payload.eventType === "INSERT") {
      const newNotification = payload.new as NotificationInfo
      setNotifications((prev) => [newNotification, ...prev])
      toast("you got mail!!!", {
        description: newNotification.data.type || "",
      })
    } else if (payload.eventType === "UPDATE") {
      const updatedNotification = payload.new as NotificationInfo
      setNotifications((prev) =>
        prev.map((n) => (n.id === updatedNotification.id ? updatedNotification : n)),
      )
    } else if (payload.eventType === "DELETE") {
      const deletedNotification = payload.old as NotificationInfo
      setNotifications((prev) => prev.filter((n) => n.id !== deletedNotification.id))
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="override" className="h-10 w-10">
          <span className="relative">
            {notifications.length > 0 && (
              <span className="bg-primary text-primary-foreground pointer-events-none absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full font-mono text-[10px] leading-none">
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}
            <BellIcon className="size-4" />
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-108">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
        {notifications.length === 0 && <div>No notifications</div>}
      </PopoverContent>
    </Popover>
  )
}
