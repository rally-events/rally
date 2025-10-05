"use client"
import { EventSearchInfo } from "@rally/api"
import React, { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card"
import { useRouter } from "next/navigation"
import { OverflowIndicator } from "./overflow-indicator"

// TODO: clean this mf mess up
// TODO: make this fetch on client and re-fetch as you move through months.

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

interface EventRun {
  eventId: string
  eventName: string
  segments: EventBarSegment[]
  startCellIndex: number
  endCellIndex: number
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

// Component for single event run with hover card
function EventRunBar({ run, href }: { run: EventRun; href: string }) {
  const cellsSpanned = run.endCellIndex - run.startCellIndex + 1
  const router = useRouter()
  // Width calculation based on cells spanned and time percentages
  const minWidth = Math.min(100 - run.startPercent, 40)
  const widthPercent = Math.max(
    (cellsSpanned - 1) * 100 + (run.endPercent - run.startPercent),
    minWidth,
  )
  const gapsSpanned = cellsSpanned - 1

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <div
          className={`pointer-events-auto absolute ${run.color} z-10 cursor-pointer truncate rounded px-1 text-xs text-white transition-opacity hover:opacity-90`}
          onClick={() => router.push(`/dashboard/event/${href}/edit`)}
          style={{
            top: `${run.verticalPosition}%`,
            left: `${run.startPercent}%`,
            width: `calc(${widthPercent}% + ${gapsSpanned} * 0.25rem)`,
            height: "30%",
            maxHeight: "24px",
          }}
        >
          {run.eventName}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto">
        <div className="text-sm font-medium">{run.eventName}</div>
      </HoverCardContent>
    </HoverCard>
  )
}

// Component for events that span multiple rows (wrap around weekends)
// This component renders multiple triggers that share hover state
function MultiRunEvent({ runs, href }: { runs: EventRun[]; href: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const trueStartIndex = runs.reduce(
    (min, run) => Math.min(min, run.startCellIndex),
    runs[0].startCellIndex,
  )

  const displayedRun = runs[0]

  return (
    <>
      <HoverCard open={isOpen} onOpenChange={setIsOpen} openDelay={50} closeDelay={100}>
        <div className="group">
          {runs.map((run, index) => {
            const cellsSpanned = run.endCellIndex - run.startCellIndex + 1

            // For multi-run events that wrap weeks:
            // First run: extends to edge (endPercent should be 100)
            // Last run: starts from edge (startPercent should be 0)
            const isFirstRun = index === 0
            const isLastRun = index === runs.length - 1

            // Calculate width based on whether this extends to cell edge
            let widthPercent: number
            let gapsSpanned: number

            if (run.endPercent === 100) {
              // Extends to right edge of cell (Saturday wrapping to Sunday)
              widthPercent = 100 - run.startPercent + (cellsSpanned - 1) * 100
              gapsSpanned = cellsSpanned - 1
            } else if (run.startPercent === 0) {
              // Starts from left edge of cell (Sunday after Saturday wrap)
              widthPercent = run.endPercent + (cellsSpanned - 1) * 100
              gapsSpanned = cellsSpanned - 1
            } else {
              // Normal case: doesn't wrap
              widthPercent = (cellsSpanned - 1) * 100 + (run.endPercent - run.startPercent)
              gapsSpanned = cellsSpanned - 1
            }

            const inFromLeft = Math.floor(run.startCellIndex / 7) > 0.99

            return (
              <HoverCardTrigger asChild key={`${run.eventId}-run-${index}`}>
                <div
                  className={`pointer-events-auto absolute group-hover:opacity-50 ${run.color} ${isFirstRun && !isLastRun ? "rounded-l" : ""} ${!isFirstRun && isLastRun ? "rounded-r" : ""} ${!isFirstRun && !isLastRun ? "rounded-none" : ""} ${isFirstRun && isLastRun ? "rounded" : ""} z-10 cursor-pointer truncate px-1 text-xs text-white transition-opacity`}
                  onClick={() => router.push(`/dashboard/event/${href}/edit`)}
                  style={{
                    top: `calc(${run.verticalPosition}% + ${!isFirstRun ? 100 * index : 0}% + ${isLastRun ? 0.25 * (index + 1) : 0}rem)`,
                    left: `calc((${inFromLeft ? trueStartIndex * 100 : run.startPercent}% + ${inFromLeft ? 0.25 * trueStartIndex : 0}rem) ${inFromLeft ? "* -1" : ""})`,
                    width: `calc(${widthPercent}% + ${gapsSpanned} * 0.25rem)`,
                    height: "30%",
                    maxHeight: "24px",
                  }}
                  // onMouseEnter={() => setIsOpen(true)}
                  // onMouseLeave={() => setIsOpen(false)}
                >
                  {run.eventName}
                </div>
              </HoverCardTrigger>
            )
          })}
        </div>
        <HoverCardContent className="w-auto">
          <div className="text-sm font-medium">{displayedRun.eventName}</div>
        </HoverCardContent>
      </HoverCard>
    </>
  )
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

  // Process events into bar segments, group by event, and create runs
  const { eventSegments, groupedEvents, eventRuns } = useMemo(() => {
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
    const sortedEvents = events.events
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

    // Create runs: group consecutive segments into continuous bars
    const runs: EventRun[] = []
    grouped.forEach((eventSegments, eventId) => {
      let currentRun: EventBarSegment[] = []

      eventSegments.forEach((segment, index) => {
        if (currentRun.length === 0) {
          currentRun.push(segment)
        } else {
          const lastSegment = currentRun[currentRun.length - 1]
          // Check if this segment continues from the last one
          // It continues if it's the next cell index AND not wrapping to a new row
          const isConsecutive = segment.cellIndex === lastSegment.cellIndex + 1
          const wrapsToNewRow = lastSegment.cellIndex % 7 === 6 && segment.cellIndex % 7 === 0

          if (isConsecutive && !wrapsToNewRow) {
            currentRun.push(segment)
          } else {
            // Save the current run and start a new one
            if (currentRun.length > 0) {
              const firstSeg = currentRun[0]
              const lastSeg = currentRun[currentRun.length - 1]
              runs.push({
                eventId,
                eventName: firstSeg.eventName,
                segments: currentRun,
                startCellIndex: firstSeg.cellIndex,
                endCellIndex: lastSeg.cellIndex,
                startPercent: firstSeg.startPercent,
                endPercent: lastSeg.endPercent,
                verticalPosition: firstSeg.verticalPosition,
                color: firstSeg.color,
                row: firstSeg.row,
              })
            }
            currentRun = [segment]
          }
        }
      })

      // Don't forget the last run
      if (currentRun.length > 0) {
        const firstSeg = currentRun[0]
        const lastSeg = currentRun[currentRun.length - 1]
        runs.push({
          eventId,
          eventName: firstSeg.eventName,
          segments: currentRun,
          startCellIndex: firstSeg.cellIndex,
          endCellIndex: lastSeg.cellIndex,
          startPercent: firstSeg.startPercent,
          endPercent: lastSeg.endPercent,
          verticalPosition: firstSeg.verticalPosition,
          color: firstSeg.color,
          row: firstSeg.row,
        })
      }
    })

    return { eventSegments: segments, groupedEvents: grouped, eventRuns: runs }
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
        {/* Render calendar cells with events as children */}
        {days.map((day, cellIndex) => {
          const isToday = isCurrentMonth && day === currentDay
          const isEmptyCell = day === null

          // Find runs that start in this cell
          const runsStartingHere = eventRuns.filter((run) => run.startCellIndex === cellIndex)

          // Group runs by event ID for multi-run handling
          const runsByEvent = new Map<string, EventRun[]>()
          eventRuns.forEach((run) => {
            if (!runsByEvent.has(run.eventId)) {
              runsByEvent.set(run.eventId, [])
            }
            runsByEvent.get(run.eventId)!.push(run)
          })

          // Track which events we've already rendered to avoid duplicates
          const renderedEvents = new Set<string>()

          // Check for overflow and prepare overflow indicator
          const overflowSegments = eventSegments.filter((seg) => seg.row > 2)
          let shouldRenderOverflow = false
          let overflowRuns: EventRun[] = []

          if (overflowSegments.length > 0) {
            // Group overflow segments by event to find overall span
            const overflowEventMap = new Map<
              string,
              {
                eventId: string
                eventName: string
                segments: typeof overflowSegments
                minCellIndex: number
                maxCellIndex: number
                minStartPercent: number
                maxEndPercent: number
                color: string
              }
            >()

            overflowSegments.forEach((seg) => {
              if (!overflowEventMap.has(seg.eventId)) {
                overflowEventMap.set(seg.eventId, {
                  eventId: seg.eventId,
                  eventName: seg.eventName,
                  segments: [seg],
                  minCellIndex: seg.cellIndex,
                  maxCellIndex: seg.cellIndex,
                  minStartPercent: seg.startPercent,
                  maxEndPercent: seg.endPercent,
                  color: seg.color,
                })
              } else {
                const event = overflowEventMap.get(seg.eventId)!
                event.segments.push(seg)
                event.minCellIndex = Math.min(event.minCellIndex, seg.cellIndex)
                event.maxCellIndex = Math.max(event.maxCellIndex, seg.cellIndex)

                // Update start/end percentages based on cell position
                if (
                  seg.cellIndex < event.minCellIndex ||
                  (seg.cellIndex === event.minCellIndex && seg.startPercent < event.minStartPercent)
                ) {
                  event.minStartPercent = seg.startPercent
                }
                if (
                  seg.cellIndex > event.maxCellIndex ||
                  (seg.cellIndex === event.maxCellIndex && seg.endPercent > event.maxEndPercent)
                ) {
                  event.maxEndPercent = seg.endPercent
                }
              }
            })

            // Find the overall span
            const allOverflowEvents = Array.from(overflowEventMap.values())
            const overallMinCell = Math.min(...allOverflowEvents.map((e) => e.minCellIndex))
            const overallMaxCell = Math.max(...allOverflowEvents.map((e) => e.maxCellIndex))

            // Only render from the starting cell of the overall overflow span
            if (cellIndex === overallMinCell) {
              shouldRenderOverflow = true

              // Find start and end percentages
              const eventsInMinCell = allOverflowEvents.filter(
                (e) => e.minCellIndex === overallMinCell,
              )
              const startPercent = Math.min(...eventsInMinCell.map((e) => e.minStartPercent))

              const eventsInMaxCell = allOverflowEvents.filter(
                (e) => e.maxCellIndex === overallMaxCell,
              )
              const endPercent = Math.max(...eventsInMaxCell.map((e) => e.maxEndPercent))

              // Create overflow runs similar to regular event runs
              let currentCell = overallMinCell
              while (currentCell <= overallMaxCell) {
                const runStart = currentCell
                const rowEnd = Math.floor(runStart / 7) * 7 + 6
                const runEnd = Math.min(rowEnd, overallMaxCell)

                // Get segments for this run
                const runSegments = overflowSegments.filter(
                  (seg) => seg.cellIndex >= runStart && seg.cellIndex <= runEnd,
                )

                overflowRuns.push({
                  eventId: "overflow-indicator",
                  eventName: `+${allOverflowEvents.length}`,
                  segments: runSegments,
                  startCellIndex: runStart,
                  endCellIndex: runEnd,
                  startPercent: runStart === overallMinCell ? startPercent : 0,
                  endPercent: runEnd === overallMaxCell ? endPercent : 100,
                  verticalPosition: 67.5, // Row 3 position
                  color: overflowSegments[0]?.color || "bg-gray-500",
                  row: 3,
                })

                if (runEnd < overallMaxCell) {
                  currentCell = runEnd + 1
                } else {
                  break
                }
              }
            }
          }

          return (
            <div
              key={cellIndex}
              className={`relative flex h-20 flex-col items-start overflow-visible rounded p-1.5 ${
                isEmptyCell ? "" : isToday ? "bg-blue-500 text-white" : "bg-surface"
              }`}
            >
              {day !== null && <span className="relative text-sm font-medium">{day}</span>}

              {/* Render events that start in this cell */}
              {runsStartingHere
                .filter((run) => run.row <= 2) // Only show first 2 rows
                .map((run) => {
                  // Skip if we've already rendered this event
                  if (renderedEvents.has(run.eventId)) {
                    return null
                  }
                  renderedEvents.add(run.eventId)

                  const allRunsForEvent = runsByEvent.get(run.eventId)!
                  const visibleRuns = allRunsForEvent.filter((r) => r.row <= 2)

                  // If this event has multiple runs (wraps), use MultiRunEvent
                  // Only render it for the first run (earliest cell index)
                  if (visibleRuns.length > 1) {
                    const firstRun = visibleRuns.reduce((earliest, current) =>
                      current.startCellIndex < earliest.startCellIndex ? current : earliest,
                    )
                    // Only render if this is the first run
                    if (run.startCellIndex === firstRun.startCellIndex) {
                      return (
                        <MultiRunEvent key={run.eventId} runs={visibleRuns} href={run.eventId} />
                      )
                    }
                    return null
                  }

                  // Single run event
                  return <EventRunBar key={run.eventId} run={run} href={run.eventId} />
                })}

              {/* Render overflow indicator if this is the starting cell */}
              {shouldRenderOverflow &&
                overflowRuns.length > 0 &&
                (() => {
                  // Collect unique overflow events for the hover card
                  const uniqueOverflowEvents = new Map<
                    string,
                    { eventId: string; eventName: string }
                  >()
                  overflowSegments.forEach((seg) => {
                    if (!uniqueOverflowEvents.has(seg.eventId)) {
                      uniqueOverflowEvents.set(seg.eventId, {
                        eventId: seg.eventId,
                        eventName: seg.eventName,
                      })
                    }
                  })

                  return (
                    <OverflowIndicator
                      runs={overflowRuns}
                      overflowEvents={Array.from(uniqueOverflowEvents.values())}
                    />
                  )
                })()}
            </div>
          )
        })}
      </div>
    </div>
  )
}
