"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle } from "lucide-react"
import { useHostEvents } from "./host-events-provider"

export default function HostEventsOverviewCards() {
  const { calendarEvents } = useHostEvents()
  const upcomingEvents = calendarEvents.slice(0, 2)

  return (
    <section className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 shadow-sm"></div>
          <div className="rounded-lg border p-4 shadow-sm"></div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-4">
        <Card className="gap-2" size="sm">
          <CardHeader className="text-muted-foreground inline-flex items-center text-sm">
            <Calendar className="size-3.5" />
            Total Events
          </CardHeader>
          <CardContent className="text-3xl font-semibold">100</CardContent>
        </Card>
        <Card className="gap-2" size="sm">
          <CardHeader className="text-muted-foreground inline-flex items-center text-sm">
            <CheckCircle className="size-3.5" />
            Total Events
          </CardHeader>
          <CardContent className="text-3xl font-semibold">100</CardContent>
        </Card>
        <Card className="gap-2" size="sm">
          <CardHeader className="text-muted-foreground inline-flex items-center text-sm">
            <CheckCircle className="size-3.5" />
            Total Events
          </CardHeader>
          <CardContent className="text-3xl font-semibold">100</CardContent>
        </Card>
      </div>
    </section>
  )
}
