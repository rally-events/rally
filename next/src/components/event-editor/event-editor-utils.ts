import { EventInfo } from "@rally/api"
import { EventEditSchema } from "./event-editor-provider"

export function formatDefaultValues(event: EventInfo): EventEditSchema {
  return {
    ...event,
    startDatetime: event.startDatetime ? new Date(event.startDatetime) : undefined,
    endDatetime: event.endDatetime ? new Date(event.endDatetime) : undefined,
    description: event.description ?? undefined,
    eventType: event.eventType ?? undefined,
    format: (event.format ?? undefined) as EventEditSchema["format"],
    themes: event.themes ?? undefined,
    usingOrganizationAddress: event.usingOrganizationAddress ?? undefined,
    streetAddress: event.streetAddress ?? undefined,
    city: event.city ?? undefined,
    state: event.state ?? undefined,
    country: event.country ?? undefined,
    zipCode: event.zipCode ?? undefined,
    expectedAttendees:
      event.expectedAttendeesMin && event.expectedAttendeesMax
        ? {
            min: event.expectedAttendeesMin,
            max: event.expectedAttendeesMax,
          }
        : undefined,
    audienceAge: (event.audienceAge ?? []) as EventEditSchema["audienceAge"],
    communitySegments: event.communitySegments ?? undefined,
    audienceInterests: event.audienceInterests ?? undefined,
    hasFamousPeople: event.hasFamousPeople ?? undefined,
    famousPeople: event.famousPeople ?? undefined,
    isTicketed: event.isTicketed ?? undefined,
    ticketCost: (event.ticketCost ?? undefined) as EventEditSchema["ticketCost"],
  }
}
