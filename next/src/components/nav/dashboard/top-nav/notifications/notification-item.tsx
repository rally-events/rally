import React from "react"
import { NotificationInfo } from "@rally/api"
import { NotificationData } from "@rally/db"
import { format, formatDistanceToNow } from "date-fns"
import { EyeIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import HoverArrow from "@/components/ui/hover-arrow"

interface NotificationItemProps {
  notification: NotificationInfo
}

const getTitleMessage = (data: NotificationData) => {
  switch (data.type) {
    case "sponsorship_request_new":
      return `${data.sponsorOrganizationName} wants to sponsor ${data.eventName}!`
    case "sponsorship_request_updated":
      return `${data.sponsorOrganizationName} updated their sponsorship request for ${data.eventName}.`
    default:
      return "Notification"
  }
}

const getActionButton = (data: NotificationData) => {
  switch (data.type) {
    case "sponsorship_request_new":
      return (
        <Link
          className={`${buttonVariants({ variant: "ghost", size: "iconSm" })} group/arrow`}
          href={`/sponsorship-requests/${data.sponsorshipRequestId}`}
        >
          <HoverArrow className="size-3" />
        </Link>
      )
    case "sponsorship_request_updated":
      return (
        <Link
          className={`${buttonVariants({ variant: "ghost", size: "iconSm" })} group/arrow`}
          href={`/sponsorship-requests/${data.sponsorshipRequestId}`}
        >
          <HoverArrow className="size-3" />
        </Link>
      )
  }
}

export default function notificationItem({ notification }: NotificationItemProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border py-1 pr-1 pl-3">
      <div className="bg-primary size-6 rounded" />
      <div className="flex flex-col">
        <p className="text-sm leading-tight font-medium">{getTitleMessage(notification.data)}</p>
        <span className="group relative w-fit cursor-default select-none">
          <p className="text-muted-foreground absolute top-0 left-0 text-xs leading-tight transition-opacity duration-150 group-hover:opacity-0">
            {formatDistanceToNow(notification.createdAt)} ago
          </p>
          <p className="text-muted-foreground text-xs leading-tight opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            {format(notification.createdAt, "MM/dd/yyyy, h:mma")
              .replace("AM", "am")
              .replace("PM", "pm")}
          </p>
        </span>
      </div>
      <div className="ml-auto">{getActionButton(notification.data)}</div>
    </div>
  )
}
