"use client"

import { UserInfo } from "@rally/api"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import EventListViewSelector from "./event-list-view-selector"
import HostEventListFilters from "./host-event-list-filters"
import z from "zod"
import { searchEventsSchema } from "@rally/schemas"

export default function HostEventsList({ user }: { user: UserInfo }) {
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<z.infer<typeof searchEventsSchema>>({
    limit: 12,
    page: 0,
    startDateRange: new Date(),
    endDateRange: undefined,
    format: ["in-person", "virtual", "hybrid"],
  })
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-3xl font-medium">Your Events</CardTitle>
        <div className="flex items-center gap-2">
          <HostEventListFilters filters={filters} setFilters={setFilters} />
          <EventListViewSelector currentView={currentView} setCurrentView={setCurrentView} />
          <Button>Create Event</Button>
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  )
}
