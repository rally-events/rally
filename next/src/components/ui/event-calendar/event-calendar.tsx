"use client"
import { EventSearchInfo } from "@rally/api"
import React, { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card"

interface EventCalendarProps {
  events: EventSearchInfo
}

interface EventBarSegment {
  eventId: string
  eventName: string
  cellIndex: number
  startPercent: number
  endPercent: number
  verticalPosition: number
  color: string
  row: number
}

// Helper: Get time of day as percentage (0-1)
function getTimeOfDayPercent(date: Date): number {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return (hours * 60 + minutes) / (24 * 60)
}

// Helper: Convert time percentage to cell position (10% to 90%)
function timeToPosition(timePercent: number): number {
  return 10 + timePercent * 80
}

// Helper: Get date at start of day
function getDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const today = new Date()
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year
  const currentDay = today.getDate()

  const days: (number | null)[] = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthName = firstDayOfMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const currentYear = new Date().getFullYear()
  const minDate = new Date(currentYear - 5, 0, 1)
  const maxDate = new Date(currentYear + 5, 11, 31)

  const canGoBack = new Date(year, month - 1, 1) >= minDate
  const canGoForward = new Date(year, month + 1, 1) <= maxDate

  const goToPreviousMonth = () => {
    if (canGoBack) {
      setCurrentDate(new Date(year, month - 1, 1))
    }
  }

  const goToNextMonth = () => {
    if (canGoForward) {
      setCurrentDate(new Date(year, month + 1, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Process events into bar segments and group by event
  const { eventSegments, groupedEvents } = useMemo(() => {
    const segments: EventBarSegment[] = []

    // Color palette for events
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-sky-500",
      "bg-indigo-500",
      "bg-violet-500",
      "bg-purple-500",
      "bg-fuchsia-500",
      "bg-pink-500",
      "bg-rose-500",
    ]

    // Filter and sort events chronologically (earliest first)
    const sortedEvents = events
      .filter((event) => event.startDatetime && event.endDatetime)
      .map((event, index) => ({
        ...event,
        startDatetime: new Date(event.startDatetime!),
        endDatetime: new Date(event.endDatetime!),
        color: colors[index % colors.length],
      }))
      .sort((a, b) => a.startDatetime.getTime() - b.startDatetime.getTime())

    // Event row assignment map
    const eventRowMap = new Map<string, number>()

    // Active events tracker: array of {eventId, endDate, row}
    interface ActiveEvent {
      eventId: string
      endDate: Date
      row: number
    }
    const activeEvents: ActiveEvent[] = []

    // Helper to find lowest available row
    const findAvailableRow = (): number => {
      const occupiedRows = new Set(activeEvents.map((e) => e.row))
      let row = 1
      while (occupiedRows.has(row)) {
        row++
      }
      return row
    }

    // Process each day of the month
    for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
      const currentDate = new Date(year, month, dayOfMonth)
      const currentDateOnly = getDateOnly(currentDate)

      // Remove events that ended before today
      for (let i = activeEvents.length - 1; i >= 0; i--) {
        if (getDateOnly(activeEvents[i].endDate) < currentDateOnly) {
          activeEvents.splice(i, 1)
        }
      }

      // Find events that start on this day
      const eventsStartingToday = sortedEvents.filter(
        (event) => getDateOnly(event.startDatetime).getTime() === currentDateOnly.getTime(),
      )

      // Assign rows to new events and add to active events
      eventsStartingToday.forEach((event) => {
        const row = findAvailableRow()
        eventRowMap.set(event.id, row)
        activeEvents.push({
          eventId: event.id,
          endDate: event.endDatetime,
          row,
        })
      })
    }

    // Now generate segments for all events using their assigned rows
    sortedEvents.forEach((event) => {
      const eventStart = event.startDatetime
      const eventEnd = event.endDatetime
      const row = eventRowMap.get(event.id)!
      // New spacing: 2.5% gap at top, then 30% per row with 2.5% gaps
      // Row 1: 2.5%, Row 2: 35%, Row 3: 67.5%
      const verticalPosition = 2.5 + (row - 1) * 32.5

      // Find which cells this event spans
      let currentDate = getDateOnly(eventStart)
      const endDate = getDateOnly(eventEnd)

      while (currentDate <= endDate) {
        // Check if this date is in the visible calendar
        if (
          currentDate.getFullYear() === year &&
          currentDate.getMonth() === month &&
          currentDate.getDate() >= 1 &&
          currentDate.getDate() <= daysInMonth
        ) {
          const dayOfMonth = currentDate.getDate()
          const cellIndex = startingDayOfWeek + dayOfMonth - 1

          // Calculate start and end positions for this segment
          let segmentStart = 0
          let segmentEnd = 100

          // If this is the first day of the event
          if (currentDate.getTime() === getDateOnly(eventStart).getTime()) {
            const timePercent = getTimeOfDayPercent(eventStart)
            segmentStart = timeToPosition(timePercent)
          }

          // If this is the last day of the event
          if (currentDate.getTime() === getDateOnly(eventEnd).getTime()) {
            const timePercent = getTimeOfDayPercent(eventEnd)
            segmentEnd = timeToPosition(timePercent)
          }

          // Handle row wrapping: if we're at the end of a row and continuing
          const isEndOfRow = cellIndex % 7 === 6
          if (isEndOfRow && currentDate < endDate) {
            segmentEnd = 100
          }

          const isStartOfRow = cellIndex % 7 === 0
          if (isStartOfRow && currentDate > getDateOnly(eventStart)) {
            segmentStart = 0
          }

          segments.push({
            eventId: event.id,
            eventName: event.name,
            cellIndex,
            startPercent: segmentStart,
            endPercent: segmentEnd,
            verticalPosition,
            color: event.color,
            row,
          })
        }

        // Move to next day
        currentDate = new Date(currentDate)
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })

    // Group segments by event ID
    const grouped = new Map<string, EventBarSegment[]>()
    segments.forEach((segment) => {
      if (!grouped.has(segment.eventId)) {
        grouped.set(segment.eventId, [])
      }
      grouped.get(segment.eventId)!.push(segment)
    })

    return { eventSegments: segments, groupedEvents: grouped }
  }, [events, year, month, daysInMonth, startingDayOfWeek])

  return (
    <div className="flex flex-col">
      <div className="relative mb-1 flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={goToToday} className="absolute left-0">
          Today
        </Button>
        <Button variant="ghost" size="icon" onClick={goToPreviousMonth} disabled={!canGoBack}>
          <ChevronLeft />
        </Button>
        <h2 className="">{monthName}</h2>
        <Button variant="ghost" size="icon" onClick={goToNextMonth} disabled={!canGoForward}>
          <ChevronRight />
        </Button>
      </div>
      <div className="grid grid-cols-7">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-muted-foreground mb-1 text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="relative grid grid-cols-7 grid-rows-6 gap-1">
        {/* Render calendar cells */}
        {days.map((day, i) => {
          const isToday = isCurrentMonth && day === currentDay
          const isEmptyCell = day === null

          return (
            <div
              key={i}
              className={`relative flex h-20 flex-col items-start overflow-hidden rounded p-1.5 ${
                isEmptyCell ? "" : isToday ? "bg-blue-500 text-white" : "bg-surface"
              }`}
            >
              {day !== null && <span className="relative z-10 text-sm font-medium">{day}</span>}
            </div>
          )
        })}

        {/* Render events as unified components spanning across cells */}
        {Array.from(groupedEvents.entries()).map(([eventId, segments]) => {
          const firstSegment = segments[0]
          const visibleSegments = segments.filter((seg) => seg.row <= 2)

          if (visibleSegments.length === 0) return null

          return (
            <HoverCard key={eventId} openDelay={200}>
              <HoverCardTrigger asChild>
                <div className="pointer-events-none absolute inset-0">
                  {visibleSegments.map((segment, segIndex) => {
                    const width = Math.max(40, segment.endPercent - segment.startPercent)
                    const isEndOfRow = segment.cellIndex % 7 === 6
                    const isStartOfRow = segment.cellIndex % 7 === 0

                    // Check if this segment continues to the next cell
                    const continuesRight =
                      segIndex < visibleSegments.length - 1 &&
                      visibleSegments[segIndex + 1].cellIndex === segment.cellIndex + 1
                    const continuesLeft =
                      segIndex > 0 &&
                      visibleSegments[segIndex - 1].cellIndex === segment.cellIndex - 1

                    // Determine border radius
                    let roundedClass = "rounded"
                    if (continuesRight && !isEndOfRow) {
                      roundedClass = continuesLeft && !isStartOfRow ? "rounded-none" : "rounded-l"
                    } else if (continuesLeft && !isStartOfRow) {
                      roundedClass = "rounded-r"
                    }

                    // Calculate absolute position
                    const row = Math.floor(segment.cellIndex / 7)
                    const col = segment.cellIndex % 7

                    // Cell dimensions: h-20 = 80px, gap-1 = 4px
                    const cellHeight = 80
                    const cellGap = 4
                    const totalCellHeight = cellHeight + cellGap

                    return (
                      <div
                        key={`${segment.eventId}-${segIndex}`}
                        className={`pointer-events-auto absolute ${segment.color} ${roundedClass} truncate px-1 text-xs text-white transition-opacity hover:opacity-90`}
                        style={{
                          // Position relative to the grid
                          top: `calc(${row} * (5rem + 0.25rem) + ${segment.verticalPosition}%)`,
                          left: `calc(${col} * (100% / 7) + ${col} * 0.25rem + ${segment.startPercent}%)`,
                          width: `calc((100% / 7) * ${width / 100} - ${cellGap * (width / 100)}px)`,
                          height: "30%",
                          maxHeight: `${cellHeight * 0.3}px`,
                        }}
                      >
                        {segment.eventName}
                      </div>
                    )
                  })}
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto">
                <div className="text-sm font-medium">{firstSegment.eventName}</div>
              </HoverCardContent>
            </HoverCard>
          )
        })}

        {/* Render overflow indicators */}
        {days.map((day, i) => {
          const cellSegments = eventSegments.filter((seg) => seg.cellIndex === i)
          const maxRow = Math.max(0, ...cellSegments.map((seg) => seg.row))
          const hasOverflow = maxRow > 2

          if (!hasOverflow) return null

          const overflowSegments = cellSegments.filter((seg) => seg.row > 2)
          const overflowCount = new Set(overflowSegments.map((seg) => seg.eventId)).size

          // Get unique overflow events
          const uniqueOverflowEvents = Array.from(
            new Map(overflowSegments.map((seg) => [seg.eventId, seg])).values(),
          )

          const overflowStart = Math.min(...overflowSegments.map((seg) => seg.startPercent))
          const overflowEnd = Math.max(...overflowSegments.map((seg) => seg.endPercent))
          const firstOverflowSegment = overflowSegments[0]

          const row = Math.floor(i / 7)
          const col = i % 7
          const cellGap = 4

          return (
            <HoverCard key={`overflow-${i}`} openDelay={200}>
              <HoverCardTrigger asChild>
                <div
                  className={`pointer-events-auto absolute ${firstOverflowSegment.color} flex items-center justify-center rounded px-1 text-xs font-semibold text-white transition-opacity hover:opacity-60`}
                  style={{
                    top: `calc(${row} * (5rem + 0.25rem) + 67.5%)`,
                    left: `calc(${col} * (100% / 7) + ${col} * 0.25rem + ${overflowStart}%)`,
                    width: `calc((100% / 7) * ${Math.max(40, overflowEnd - overflowStart) / 100} - ${cellGap * (Math.max(40, overflowEnd - overflowStart) / 100)}px)`,
                    height: "30%",
                    maxHeight: "24px",
                  }}
                >
                  +{overflowCount}
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto">
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium">Hidden Events:</div>
                  {uniqueOverflowEvents.map((seg) => (
                    <div key={seg.eventId} className="text-sm">
                      • {seg.eventName}
                    </div>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          )
        })}
      </div>
    </div>
  )
}
