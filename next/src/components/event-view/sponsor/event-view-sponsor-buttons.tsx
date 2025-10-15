"use client"
import { EventInfo } from "@rally/api"
import React, { useState } from "react"
import EventViewSponsorModal from "./event-view-sponsor-modal"
import { Card, CardContent } from "@/components/ui/card"

interface EventViewSponsorButtonsProps {
  event: EventInfo<{ withOrganization: true; withMedia: true }>
}

export default function EventViewSponsorButtons({ event }: EventViewSponsorButtonsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card size="sm">
      <CardContent>
        <EventViewSponsorModal eventId={event.id} isOpen={isOpen} setIsOpen={setIsOpen} />
      </CardContent>
    </Card>
  )
}
