import HostEventsList from "@/components/host-events/host-events-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import EventCalendar from "@/components/ui/event-calendar/event-calendar"
import { api } from "@/lib/trpc/server"
import { notFound } from "next/navigation"
import React from "react"

export default async function page() {
  const caller = await api()
  const user = await caller.user.getUserInfo()
  if (!user || !user.organizationId) {
    notFound()
  }
  const events = await caller.event.searchEvents({
    organizationId: user.organizationId,
  })
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <section>
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 className="text-2xl font-bold">Events</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>We will be showing stats and quick actions and stuff here.</p>
            </CardContent>
          </Card>
        </section>
        <section>
          <Card>
            <CardContent>
              <EventCalendar events={events} />
            </CardContent>
          </Card>
        </section>
      </div>
      <section>
        <HostEventsList user={user} />
      </section>
    </div>
  )
}
