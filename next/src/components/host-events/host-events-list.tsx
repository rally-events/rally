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
import { toast } from "sonner"

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

export const EVENT_HOST_TABLE_LIMIT = 12

export default function HostEventsList({ user }: { user: UserInfo }) {
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<z.infer<typeof searchEventsSchema>>({
    limit: EVENT_HOST_TABLE_LIMIT,
    page: 0,
    ...defaultFilters,
  })
  const utils = api.useUtils()
  const { data: events, isLoading } = api.event.searchEvents.useQuery(filters)
  const { mutate: deleteEvent, isPending: isDeleteEventPending } =
    api.event.deleteEvent.useMutation({
      onMutate: async (variables) => {
        // Cancel outgoing refetches
        await utils.event.searchEvents.cancel(filters)

        // Snapshot the previous value
        const previousEvents = utils.event.searchEvents.getData(filters)

        // Optimistically update to remove the event
        utils.event.searchEvents.setData(filters, (old) => {
          if (!old) return old
          return {
            ...old,
            events: old.events.filter((event) => event.id !== variables.id),
            totalCount: old.totalCount - 1,
          }
        })

        return { previousEvents }
      },
      onError: (_, __, context) => {
        if (context?.previousEvents) {
          utils.event.searchEvents.setData(filters, context.previousEvents)
        }
        toast.error("Failed to delete event")
      },
      onSettled: () => {
        utils.event.searchEvents.invalidate(filters)
      },
    })

  const handleFilterSubmit = (values: z.infer<typeof searchEventsSchema>) => {
    // doing it this verbose to set undefined values back to undefined
    setFilters({
      limit: EVENT_HOST_TABLE_LIMIT,
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

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }))
  }

  const handleDeleteEvent = (id: string) => {
    deleteEvent({ id })
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
          data={events?.events ?? []}
          isLoading={isLoading}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={handleSortChange}
          onDeleteEvent={handleDeleteEvent}
          deleteEventPending={isDeleteEventPending}
          totalCount={events?.totalCount ?? 0}
          currentPage={filters.page}
          pageSize={EVENT_HOST_TABLE_LIMIT}
          onPageChange={handlePageChange}
        />
      </CardContent>
    </Card>
  )
}
