"use client"
import { EventSearchInfo } from "@rally/api"
import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../button"

interface EventCalendarProps {
  events: EventSearchInfo
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
      <div className="grid grid-cols-7 grid-rows-6 gap-1">
        {days.map((day, i) => {
          const isToday = isCurrentMonth && day === currentDay
          const isEmptyCell = day === null

          return (
            <div
              key={i}
              className={`flex h-20 flex-col items-start rounded p-1.5 ${
                isEmptyCell ? "" : isToday ? "bg-blue-500 text-white" : "bg-surface"
              }`}
            >
              {day !== null && <span className="text-sm font-medium">{day}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
