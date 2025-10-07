import { EventInfo } from "@rally/api"
import React from "react"
import EventViewPoster from "./event-view-poster"
import EventViewHeader from "./event-view-header"
import { Separator } from "../ui/separator"
import EventViewOwner from "./event-view-owner"

export type EventViewProps = {
  event: EventInfo<{ withOrganization: true; withMedia: true }>
}

export default function EventView({ event }: EventViewProps) {
  const poster = event.media.find((media) => media.media.mediaType === "poster")

  return (
    <>
      <EventViewOwner event={event} />
      <div className="flex flex-col gap-12 pt-8 pl-8">
        {poster ? (
          <div className="flex gap-12 pt-8 pl-8">
            <section>
              <EventViewPoster poster={poster} />
            </section>
            <section className="pt-8">
              <EventViewHeader event={event} />
            </section>
          </div>
        ) : (
          <section className="pt-8">
            <EventViewHeader event={event} />
          </section>
        )}
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
