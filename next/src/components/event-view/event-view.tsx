import { EventInfo } from "@rally/api"
import React from "react"

export type EventViewProps = {
  event: EventInfo<{ withOrganization: true; withMedia: true }>
}

export default function EventView({ event }: EventViewProps) {
  return (
    <div>
      <div>
        <h1>{event.name}</h1>
        <p>{event.description}</p>
      </div>
    </div>
  )
}
