"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle } from "lucide-react"
import { useHostEvents } from "./host-events-provider"
import HostEventCard from "./host-event-card"

export default function HostEventsOverviewCards() {
  const { stats, upcomingEvents } = useHostEvents()

  return (
    <section className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {upcomingEvents.slice(0, 2).map((event) => (
            <HostEventCard key={event.id} event={event} />
          ))}
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-4">
        <Card className="gap-2" size="sm">
          <CardHeader className="text-muted-foreground inline-flex items-center text-sm">
            <Calendar className="size-3.5" />
            Sponsored Events
          </CardHeader>
          <CardContent className="text-3xl font-semibold">100</CardContent>
        </Card>
        <Card className="gap-2" size="sm">
          <CardHeader className="text-muted-foreground inline-flex items-center text-sm">
            <Calendar className="size-3.5" />
            Unsponsored Events
          </CardHeader>
          <CardContent className="text-3xl font-semibold">100</CardContent>
        </Card>
        <Card className="gap-2" size="sm">
          <CardHeader className="text-muted-foreground inline-flex items-center text-sm">
            <CheckCircle className="size-3.5" />
            Total Revenue
          </CardHeader>
          <CardContent className="text-3xl font-semibold">$23.47</CardContent>
        </Card>
        <Card className="gap-2" size="sm">
          <CardHeader className="text-muted-foreground inline-flex items-center text-sm">
            <CheckCircle className="size-3.5" />
            Total Events
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.totalCount}</CardContent>
        </Card>
        <Card className="gap-2" size="sm">
          <CardHeader className="text-muted-foreground inline-flex items-center text-sm">
            <CheckCircle className="size-3.5" />
            Upcoming Events
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.upcomingCount}</CardContent>
        </Card>
      </div>
    </section>
  )
}
