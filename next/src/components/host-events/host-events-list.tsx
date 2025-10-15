"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import EventListViewSelector from "./event-list-view-selector"
import HostEventListFilters from "./host-event-list-filters"
import HostEventsDataTable from "./host-event-data-table/host-events-data-table"
import { PlusIcon } from "lucide-react"
import { useHostEvents, EVENT_HOST_TABLE_LIMIT } from "./host-events-provider"

export default function HostEventsList() {
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid")
  const {
    filters,
    setFilters,
    listEvents,
    listEventsLoading,
    totalCount,
    createEvent,
    isCreateEventPending,
    deleteEvent,
    isDeleteEventPending,
    handleFilterSubmit,
    handleSortChange,
    handlePageChange,
  } = useHostEvents()

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
          <Button onClick={() => createEvent()} isLoading={isCreateEventPending}>
            Create Event <PlusIcon />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <HostEventsDataTable
          data={listEvents}
          isLoading={listEventsLoading}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={handleSortChange}
          onDeleteEvent={deleteEvent}
          deleteEventPending={isDeleteEventPending}
          totalCount={totalCount}
          currentPage={filters.page}
          pageSize={EVENT_HOST_TABLE_LIMIT}
          onPageChange={handlePageChange}
        />
      </CardContent>
    </Card>
  )
}
