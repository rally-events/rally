import { Card, CardContent } from "@/components/ui/card"
import React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { EventEditSchema } from "../../event-editor-provider"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"

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
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col gap-3">
              <Label htmlFor="date-from" className="px-1">
                Event starts at
              </Label>
              <Controller
                name="startDatetime"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-from"
                        className="w-full justify-between font-normal"
                      >
                        {field.value
                          ? field.value.toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Pick a date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.startDatetime && (
                <p className="text-sm text-red-500">{errors.startDatetime.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-from" className="invisible px-1">
                Starts at
              </Label>
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
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col gap-3">
              <Label htmlFor="date-to" className="px-1">
                Event ends at
              </Label>
              <Controller
                name="endDatetime"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-to"
                        className="w-full justify-between font-normal"
                      >
                        {field.value
                          ? field.value.toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Pick a date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.endDatetime && (
                <p className="text-sm text-red-500">{errors.endDatetime.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-to" className="invisible px-1">
                Ends at
              </Label>
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
