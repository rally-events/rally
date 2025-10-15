import EventCard from "@/components/ui/event-card"
import { api } from "@/lib/trpc/server"
import React from "react"

export default async function EventsPage() {
  const caller = await api()
  const events = await caller.event.searchEvents({
    page: 0,
    limit: 10,
    sortBy: "startDatetime",
    sortOrder: "asc",
  })
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        {events.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
