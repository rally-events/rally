"use client"

import { UserInfo } from "@rally/api"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import EventListViewSelector from "./event-list-view-selector"
import HostEventListFilters from "./host-event-list-filters"
import z from "zod"
import { searchEventsSchema } from "@rally/schemas"
import { api } from "@/lib/trpc/client"
import HostEventsDataTable from "./host-events-data-table"

export const defaultFilters = {
  startDateRange: undefined,
  endDateRange: undefined,
  format: ["in-person", "virtual", "hybrid"] as ("in-person" | "virtual" | "hybrid")[],
  eventNameQuery: "",
  expectedAttendeesMin: undefined,
  expectedAttendeesMax: undefined,
}

const LIMIT = 24

export default function HostEventsList({ user }: { user: UserInfo }) {
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<z.infer<typeof searchEventsSchema>>({
    limit: LIMIT,
    page: 0,
    ...defaultFilters,
  })
  const { data: events, isLoading, error } = api.event.searchEvents.useQuery(filters)

  const handleFilterSubmit = (values: z.infer<typeof searchEventsSchema>) => {
    // doing it this verbose to set undefined values back to undefined
    setFilters({
      limit: LIMIT,
      page: 0,
      startDateRange: values.startDateRange,
      endDateRange: values.endDateRange,
      format: values.format,
      eventNameQuery: values.eventNameQuery,
      expectedAttendeesMin: values.expectedAttendeesMin,
      expectedAttendeesMax: values.expectedAttendeesMax,
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-3xl font-medium">Your Events</CardTitle>
        <div className="flex items-center gap-2">
          <HostEventListFilters
            filters={filters}
            setFilters={setFilters}
            handleFilterSubmit={handleFilterSubmit}
          />
          <EventListViewSelector currentView={currentView} setCurrentView={setCurrentView} />
          <Button>Create Event</Button>
        </div>
      </CardHeader>
      <CardContent>
        <HostEventsDataTable data={events ?? []} isLoading={isLoading} />
      </CardContent>
    </Card>
  )
}
