import React from "react"
import { EventInfo, UserInfo } from "@rally/api"
import { format } from "date-fns"
import EventViewSponsorButtons from "../sponsor/event-view-sponsor-buttons"
import { api } from "@/lib/trpc/server"
import EventViewSponsorAlreadyRequested from "../sponsor/event-view-sponsor-already-requested"

export default function EventViewHeader({
  event,
  user,
}: {
  event: EventInfo<{ withOrganization: true; withMedia: true }>
  user: UserInfo
}) {
  return (
    <section className="pt-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">{event.name}</h1>
          <EventViewDateTime startDatetime={event.startDatetime} endDatetime={event.endDatetime} />
        </div>
        {user.supabaseMetadata.organization_type === "sponsor" && (
          <EventSponsorButtonFetch event={event} />
        )}
      </div>
    </section>
  )
}

const EventSponsorButtonFetch = async ({
  event,
}: {
  event: EventInfo<{ withOrganization: true; withMedia: true }>
}) => {
  const caller = await api()
  const existingSponsorRequests = await caller.sponsorship.getSponsorRequests({
    eventId: event.id,
  })
  if (existingSponsorRequests.length === 0) {
    return <EventViewSponsorButtons event={event} />
  }

  // check if all sponsor requests are either rejected or approved
  const allRejectedOrApproved = existingSponsorRequests.every(
    (sponsorRequest) =>
      sponsorRequest.status === "rejected" || sponsorRequest.status === "approved",
  )
  if (allRejectedOrApproved) {
    return <EventViewSponsorButtons event={event} />
  }
  return <EventViewSponsorAlreadyRequested event={event} />
}

const EventViewDateTime = ({
  startDatetime,
  endDatetime,
}: {
  startDatetime?: Date | null
  endDatetime?: Date | null
}) => {
  // If neither date is provided, return null
  if (!startDatetime && !endDatetime) {
    return null
  }

  // If only start date is provided
  if (startDatetime && !endDatetime) {
    return (
      <div className="text-muted-foreground flex items-center gap-2">
        Starts at {format(startDatetime, "MMMM d, h:mm a")}
      </div>
    )
  }

  // If only end date is provided
  if (!startDatetime && endDatetime) {
    return (
      <div className="text-muted-foreground flex items-center gap-2">
        Ends at {format(endDatetime, "MMMM d, h:mm a")}
      </div>
    )
  }

  // Both dates are provided
  if (startDatetime && endDatetime) {
    const isSameDay = format(startDatetime, "yyyy-MM-dd") === format(endDatetime, "yyyy-MM-dd")

    if (isSameDay) {
      // Same day: "May 4th 2:30pm - 5:30pm"
      return (
        <div className="text-muted-foreground flex items-center gap-2">
          {format(startDatetime, "MMMM d, h:mm a")} - {format(endDatetime, "h:mm a")}
        </div>
      )
    } else {
      // Different days: "May 4th 2:30pm - May 6th 5:30pm"
      return (
        <div className="text-muted-foreground flex items-center gap-2">
          {format(startDatetime, "MMMM d, h:mm a")} - {format(endDatetime, "MMMM d, h:mm a")}
        </div>
      )
    }
  }

  return null
}
