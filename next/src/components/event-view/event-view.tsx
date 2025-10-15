import { EventInfo, UserInfo } from "@rally/api"
import React from "react"
import EventViewPoster from "./event-view-poster"
import EventViewHeader from "./header/event-view-header"
import { Separator } from "../ui/separator"
import EventViewOwner from "./event-view-owner"

export type EventViewProps = {
  event: EventInfo<{ withOrganization: true; withMedia: true }>
  user: UserInfo
}

export default function EventView({ event, user }: EventViewProps) {
  const poster = event.media.find((media) => media.media.mediaType === "poster")

  if (!poster) {
    // TODO: error boundary
    return null
  }

  return (
    <>
      {user.supabaseMetadata.organization_type === "host" && <EventViewOwner event={event} />}
      <div className="flex flex-col gap-12 pt-8 pl-8">
        <div className="flex gap-12 pt-8 pl-8">
          <EventViewPoster poster={poster} />
          <EventViewHeader event={event} user={user} />
        </div>

        <Separator />
        <section>
          <h1 className="text-4xl font-semibold">About the host</h1>
          <p className="text-muted-foreground">
            {event.organization?.name} is a {event.organization?.type} that is responsible for the
            event.
          </p>
        </section>
      </div>
    </>
  )
}
