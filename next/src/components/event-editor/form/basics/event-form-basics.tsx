import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SelectSearch } from "@/components/ui/select-search"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { eventTypeOptions } from "@rally/schemas"
import React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { EventEditSchema } from "../../event-editor-provider"
import { UsersIcon, VideoIcon } from "lucide-react"
import { TextareaCounter } from "@/components/ui/textarea-counter"
import EventFormBasicsAddress from "./event-form-basics-address"
import EventFormBasicsDates from "./event-form-basics-dates"

export default function EventFormBasics() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EventEditSchema>()

  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex gap-4">
            <div className="flex flex-shrink-0 flex-col gap-1">
              <Label>Event Type</Label>
              <Controller
                name="eventType"
                control={control}
                render={({ field }) => (
                  <SelectSearch
                    options={eventTypeOptions}
                    placeholder="Select Event Type"
                    value={field.value}
                    onChange={(e: any) => {
                      const value = typeof e === "string" ? e : e.target.value
                      field.onChange(value)
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                )}
              />
              {errors.eventType && <p className="text-red-500">{errors.eventType.message}</p>}
            </div>
            <div className="flex flex-grow flex-col gap-1">
              <Label>Format</Label>
              <Controller
                name="format"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-3 gap-1"
                  >
                    <label
                      htmlFor="format-in-person"
                      className="has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm font-normal has-data-[state=checked]:font-medium has-data-[state=checked]:tracking-[-0.0125em] has-data-[state=checked]:shadow-sm"
                    >
                      <RadioGroupItem value="in-person" id="format-in-person" className="sr-only" />
                      <span className="flex items-center gap-1">
                        <UsersIcon className="size-4" />
                        In-Person
                      </span>
                    </label>
                    <label
                      htmlFor="format-virtual"
                      className="has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm font-normal has-data-[state=checked]:font-medium has-data-[state=checked]:tracking-[-0.0125em] has-data-[state=checked]:shadow-sm"
                    >
                      <RadioGroupItem value="virtual" id="format-virtual" className="sr-only" />
                      <span className="flex items-center gap-1">
                        <VideoIcon className="size-4" />
                        Virtual
                      </span>
                    </label>
                    <label
                      htmlFor="format-hybrid"
                      className="has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm font-normal has-data-[state=checked]:font-medium has-data-[state=checked]:tracking-[-0.0125em] has-data-[state=checked]:shadow-sm"
                    >
                      <RadioGroupItem value="hybrid" id="format-hybrid" className="sr-only" />
                      <span className="flex items-center gap-1">
                        <UsersIcon className="size-4" />
                        Hybrid
                      </span>
                    </label>
                  </RadioGroup>
                )}
              />
              {errors.format && <p className="text-red-500">{errors.format.message}</p>}
            </div>
          </div>
          <div className="col-span-2 flex flex-grow flex-col gap-1">
            <Label>Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextareaCounter className="max-h-128 min-h-32" max={3000} {...field} />
              )}
            />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>
        </CardContent>
      </Card>
      <EventFormBasicsDates />
      <EventFormBasicsAddress />
    </div>
  )
}
