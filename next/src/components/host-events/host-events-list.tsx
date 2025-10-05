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
import HostEventsDataTable from "./host-event-data-table/host-events-data-table"

export const defaultFilters = {
  startDateRange: undefined,
  endDateRange: undefined,
  format: ["in-person", "virtual", "hybrid", "unspecified"] as (
    | "in-person"
    | "virtual"
    | "hybrid"
    | "unspecified"
  )[],
  eventNameQuery: "",
  expectedAttendeesMin: undefined,
  expectedAttendeesMax: undefined,
  sortBy: undefined,
  sortOrder: undefined,
}

const LIMIT = 12

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
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    })
  }

  const handleSortChange = (sortBy?: string, sortOrder?: "asc" | "desc") => {
    setFilters((prev) => ({
      ...prev,
      page: 0, // Reset to first page when sorting changes
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    }))
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
        <HostEventsDataTable
          data={events ?? []}
          isLoading={isLoading}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={handleSortChange}
        />
      </CardContent>
    </Card>
  )
}
