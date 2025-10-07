import React from "react"
import { EventInfo } from "@rally/api"

export default function EventViewHeader({
  event,
}: {
  event: EventInfo<{ withOrganization: true; withMedia: true }>
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
        <h1 className="text-4xl font-bold">{event.name}</h1>
        <p className="text-muted-foreground">{event.description}</p>
      </div>
    </div>
  )
}
