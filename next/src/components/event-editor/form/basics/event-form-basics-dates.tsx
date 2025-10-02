import { Card, CardContent } from "@/components/ui/card"
import React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { EventEditSchema } from "../../event-editor-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"

export default function EventFormBasicsDates() {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<EventEditSchema>()

  const startDatetime = watch("startDatetime")
  const endDatetime = watch("endDatetime")

  const formatTime = (date: Date | undefined) => {
    if (!date) return "09:00:00"
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  const combineDateTime = (date: Date | undefined, time: string) => {
    if (!date) return new Date()
    const [hours, minutes, seconds] = time.split(":").map(Number)
    const newDate = new Date(date)
    newDate.setHours(hours, minutes, seconds || 0)
    return newDate
  }

  const getMinStartDate = () => {
    const now = new Date()
    const sixHoursFromNow = new Date(now.getTime() + 6 * 60 * 60 * 1000)
    return sixHoursFromNow
  }

  const getMinEndDate = () => {
    if (!startDatetime) return undefined
    const fifteenMinutesAfterStart = new Date(startDatetime.getTime() + 15 * 60 * 1000)
    return fifteenMinutesAfterStart
  }

  const isEndDateValid = (newStartDate: Date) => {
    if (!endDatetime) return true
    const minEndDate = new Date(newStartDate.getTime() + 15 * 60 * 1000)
    return endDatetime >= minEndDate
  }

  return (
    <Card>
      <CardContent>
        <div className="relative flex items-stretch gap-2">
          <div className="flex flex-grow flex-col items-center gap-2">
            <div className="flex flex-1 flex-col gap-3">
              <Label htmlFor="date-from">Starts at...</Label>
              <Controller
                name="startDatetime"
                control={control}
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        const time = formatTime(field.value)
                        const newDateTime = combineDateTime(date, time)
                        field.onChange(newDateTime)
                        // Clear end date if it becomes invalid
                        if (!isEndDateValid(newDateTime)) {
                          setValue("endDatetime", undefined)
                        }
                      }
                    }}
                    disabled={{ before: getMinStartDate() }}
                  />
                )}
              />
              {errors.startDatetime && (
                <p className="text-sm text-red-500">{errors.startDatetime.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Controller
                name="startDatetime"
                control={control}
                render={({ field }) => (
                  <Input
                    type="time"
                    id="time-from"
                    step="1"
                    value={formatTime(field.value)}
                    onChange={(e) => {
                      const newDateTime = combineDateTime(field.value, e.target.value)
                      field.onChange(newDateTime)
                      // Clear end date if it becomes invalid
                      if (!isEndDateValid(newDateTime)) {
                        setValue("endDatetime", undefined)
                      }
                    }}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                )}
              />
            </div>
          </div>
          <div className="bg-border w-px flex-shrink-0 self-stretch" />
          <div className="flex flex-grow flex-col items-center gap-2">
            <div className="flex flex-1 flex-col gap-3">
              <Label htmlFor="date-to">Ends at...</Label>
              <Controller
                name="endDatetime"
                control={control}
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (date) {
                        const time = formatTime(field.value)
                        field.onChange(combineDateTime(date, time))
                      }
                    }}
                    disabled={getMinEndDate() ? { before: getMinEndDate()! } : undefined}
                  />
                )}
              />
              {errors.endDatetime && (
                <p className="text-sm text-red-500">{errors.endDatetime.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Controller
                name="endDatetime"
                control={control}
                render={({ field }) => (
                  <Input
                    type="time"
                    id="time-to"
                    step="1"
                    value={formatTime(field.value)}
                    onChange={(e) => {
                      field.onChange(combineDateTime(field.value, e.target.value))
                    }}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                )}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
