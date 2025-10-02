import { EventSearchInfo } from "@rally/api"
import React from "react"

interface EventCalendarItemProps {
  event: EventSearchInfo[number]
}
export default function EventCalendarItem({ event }: EventCalendarItemProps) {
  return <div>event-calendar-item</div>
}
