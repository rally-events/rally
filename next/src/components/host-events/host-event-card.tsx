"use client"
import { EventInfo } from "@rally/api"
import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import BlurHashImage from "../ui/blurhash-image"
import { EventRow } from "./host-event-data-table/host-events-data-table"
import { Button } from "../ui/button"

interface HostEventCardProps {
  event: EventRow
}

export default function HostEventCard({ event }: HostEventCardProps) {
  return (
    <Card size="sm" className="h-fit">
      <CardHeader className="gap-0">
        <CardTitle className="line-clamp-2 text-lg">{event.name}</CardTitle>
        {event.startDatetime && (
          <CardDescription className="text-muted-foreground inline-flex items-center gap-1 text-sm">
            <CalendarIcon className="size-3.5" />
            {format(event.startDatetime, "MMM d, yyyy h:mm a")}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <BlurHashImage
          src={event.poster?.downloadUrl}
          alt={event.name}
          blurhash={event.poster?.media.blurhash}
          aspectRatio={event.poster?.media.aspectRatio}
          className="mx-auto w-full max-w-56 rounded-lg"
        />
        <p className="text-muted-foreground line-clamp-2 text-sm">{event.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">View</Button>
        <Button variant="outline">Edit</Button>
      </CardFooter>
    </Card>
  )
}
