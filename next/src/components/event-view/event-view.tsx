import { EventInfo } from "@rally/api"
import React from "react"
import EventViewPoster from "./event-view-poster"
import EventViewHeader from "./event-view-header"

export type EventViewProps = {
  event: EventInfo<{ withOrganization: true; withMedia: true }>
}

export default function EventView({ event }: EventViewProps) {
  const poster = event.media.find((media) => media.media.mediaType === "poster")
  if (poster) {
    return (
      <div className="grid grid-cols-2 gap-12">
        <section>
          <EventViewPoster poster={poster} />
        </section>
        <section>
          <EventViewHeader event={event} />
        </section>
      </div>
    )
  }
  return (
    <div>
      <div>
        <h1>{event.name}</h1>
        <p>{event.description}</p>
      </div>
    </div>
  )
}
