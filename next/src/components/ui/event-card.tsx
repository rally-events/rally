import { EventInfo } from "@rally/api"
import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card"
import { Button, buttonVariants } from "./button"
import Link from "next/link"

interface EventCardProps {
  event: EventInfo
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 text-sm">{event.description}</p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/dashboard/event/${event.id}`}
          className={buttonVariants({ variant: "outline" })}
        >
          View
        </Link>
      </CardFooter>
    </Card>
  )
}
