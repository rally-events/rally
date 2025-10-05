"use client"
import React, { useState } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card"

interface EventRun {
  eventId: string
  eventName: string
  startCellIndex: number
  endCellIndex: number
  startPercent: number
  endPercent: number
  verticalPosition: number
  color: string
  row: number
}

interface OverflowIndicatorProps {
  runs: EventRun[]
  overflowEvents: { eventId: string; eventName: string }[]
}

export function OverflowIndicator({ runs, overflowEvents }: OverflowIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Calculate the true start index for positioning (leftmost cell)
  const trueStartIndex = runs.reduce(
    (min, run) => Math.min(min, run.startCellIndex),
    runs[0].startCellIndex,
  )

  const displayRun = runs[0]
  const eventCount = overflowEvents.length

  // Single run case
  if (runs.length === 1) {
    const run = runs[0]
    const cellsSpanned = run.endCellIndex - run.startCellIndex + 1
    const widthPercent = (cellsSpanned - 1) * 100 + (run.endPercent - run.startPercent)
    const gapsSpanned = cellsSpanned - 1

    return (
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div
            className={`pointer-events-auto absolute ${run.color} z-10 flex cursor-pointer items-center justify-center rounded px-1 text-xs font-semibold text-white transition-opacity hover:opacity-60`}
            style={{
              top: `${run.verticalPosition}%`,
              left: `${run.startPercent}%`,
              width: `calc(${widthPercent}% + ${gapsSpanned} * 0.25rem)`,
              height: "30%",
              maxHeight: "24px",
            }}
          >
            +{eventCount}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-auto">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium">Hidden Events:</div>
            {overflowEvents.map((event) => (
              <div key={event.eventId} className="text-sm">
                • {event.eventName}
              </div>
            ))}
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  }

  // Multi-run case (wraps across weeks)
  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen} openDelay={50} closeDelay={100}>
      <div className="group">
        {runs.map((run, index) => {
          const cellsSpanned = run.endCellIndex - run.startCellIndex + 1
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
            <HoverCardTrigger asChild key={`overflow-run-${index}`}>
              <div
                className={`pointer-events-auto absolute group-hover:opacity-60 ${run.color} ${
                  isFirstRun && !isLastRun ? "rounded-l" : ""
                } ${!isFirstRun && isLastRun ? "rounded-r" : ""} ${
                  !isFirstRun && !isLastRun ? "rounded-none" : ""
                } ${isFirstRun && isLastRun ? "rounded" : ""} z-10 flex cursor-pointer items-center justify-center px-1 text-xs font-semibold text-white transition-opacity`}
                style={{
                  top: `calc(${run.verticalPosition}% + ${!isFirstRun ? 100 * index : 0}% + ${
                    isLastRun ? 0.25 * (index + 1) : 0
                  }rem)`,
                  left: `calc((${inFromLeft ? trueStartIndex * 100 : run.startPercent}% + ${
                    inFromLeft ? 0.25 * trueStartIndex : 0
                  }rem) ${inFromLeft ? "* -1" : ""})`,
                  width: `calc(${widthPercent}% + ${gapsSpanned} * 0.25rem)`,
                  height: "30%",
                  maxHeight: "24px",
                }}
              >
                +{eventCount}
              </div>
            </HoverCardTrigger>
          )
        })}
      </div>
      <HoverCardContent className="w-auto">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">Hidden Events:</div>
          {overflowEvents.map((event) => (
            <div key={event.eventId} className="text-sm">
              • {event.eventName}
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
