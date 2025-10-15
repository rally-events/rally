import React from "react"
import { EventInfo } from "@rally/api"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export default function EventViewHeader({
  event,
}: {
  event: EventInfo<{ withOrganization: true; withMedia: true }>
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <EventViewDateTime startDatetime={event.startDatetime} endDatetime={event.endDatetime} />
      </div>
    </div>
  )
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
