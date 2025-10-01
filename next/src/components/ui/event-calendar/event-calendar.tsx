"use client"
import { EventSearchInfo } from "@rally/api"
import React from "react"

interface EventCalendarProps {
  events: EventSearchInfo
}

export default function EventCalendar({ events }: EventCalendarProps) {
  return <div>event-calendar</div>
}
