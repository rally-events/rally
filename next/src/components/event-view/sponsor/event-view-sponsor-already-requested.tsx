"use client"
import { EventInfo } from "@rally/api"
import React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface EventViewSponsorAlreadyRequestedProps {
  event: EventInfo<{ withOrganization: true; withMedia: true }>
}

export default function EventViewSponsorAlreadyRequested({
  event,
}: EventViewSponsorAlreadyRequestedProps) {
  return (
    <Card size="sm">
      <CardContent>
        <p>You have already requested to sponsor this event</p>
      </CardContent>
    </Card>
  )
}
