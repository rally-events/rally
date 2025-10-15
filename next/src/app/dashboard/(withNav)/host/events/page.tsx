import HostEventsList from "@/components/host-events/host-events-list"
import HostEventsOverviewCards from "@/components/host-events/host-events-overview-cards"
import HostEventsProvider from "@/components/host-events/host-events-provider"
import { Card, CardContent } from "@/components/ui/card"
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

  return (
    <HostEventsProvider user={user}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <HostEventsOverviewCards />

          <section>
            <Card>
              <CardContent>
                <EventCalendar />
              </CardContent>
            </Card>
          </section>
        </div>
        <section>
          <HostEventsList />
        </section>
      </div>
    </HostEventsProvider>
  )
}
