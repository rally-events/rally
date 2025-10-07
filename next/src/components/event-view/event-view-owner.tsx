import { EventInfo } from "@rally/api"
import React from "react"
import { api } from "@/lib/trpc/server"
import { buttonVariants } from "../ui/button"
import { PencilIcon, ShareIcon } from "lucide-react"
import Link from "next/link"

export default async function EventViewOwner({
  event,
}: {
  event: EventInfo<{ withOrganization: true; withMedia: true }>
}) {
  const caller = await api()
  const user = await caller.user.getUserInfo()
  if (!user || !user.organizationId || user.organizationId !== event.organizationId) {
    return null
  }

  return (
    <div className="bg-accent -mb-8 flex items-center justify-between rounded-lg border px-4 py-2">
      <div className="flex flex-col">
        <h2 className="font-medium">This is your event</h2>
        <p className="text-muted-foreground text-sm">
          This is what sponsors will see when they view your event.
        </p>
      </div>
      <div className="flex gap-2">
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/dashboard/event/${event.id}/edit`}
        >
          <PencilIcon />
          Edit
        </Link>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/dashboard/event/${event.id}`}
        >
          <ShareIcon />
          Share
        </Link>
      </div>
    </div>
  )
}
