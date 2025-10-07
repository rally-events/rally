import React from "react"
import { EventInfo } from "@rally/api"

export default function EventViewHeader({
  event,
}: {
  event: EventInfo<{ withOrganization: true; withMedia: true }>
}) {
  return <div>event-view-header</div>
}
