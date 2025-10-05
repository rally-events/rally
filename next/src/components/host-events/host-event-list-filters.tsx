"use client"
import React, { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { FilterIcon, CalendarIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import z from "zod"
import { searchEventsSchema } from "@rally/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { defaultFilters } from "./host-events-list"

interface HostEventListFiltersProps {
  filters: z.infer<typeof searchEventsSchema>
  setFilters: React.Dispatch<React.SetStateAction<z.infer<typeof searchEventsSchema>>>
  handleFilterSubmit: (values: z.infer<typeof searchEventsSchema>) => void
}

export default function HostEventListFilters({
  filters,
  setFilters,
  handleFilterSubmit,
}: HostEventListFiltersProps) {
  const [open, setOpen] = useState(false)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const form = useForm<z.input<typeof searchEventsSchema>>({
    resolver: zodResolver(searchEventsSchema),
    mode: "onBlur",
    defaultValues: filters,
  })

  const handleOpenChange = async (shouldOpen: boolean) => {
    if (!shouldOpen) {
      // User is trying to close the popover - validate first
      const isValid = await form.trigger()
      if (!isValid) {
        // Don't close if validation fails
        return
      }
      // Submit the form if valid - parse to apply defaults
      const values = form.getValues()
      const parsedValues = searchEventsSchema.parse(values)
      handleFilterSubmit(parsedValues)
    }
    setOpen(shouldOpen)
  }

  const formatOptions: Array<{ value: "in-person" | "virtual" | "hybrid"; label: string }> = [
    { value: "in-person", label: "In-Person" },
    { value: "virtual", label: "Virtual" },
    { value: "hybrid", label: "Hybrid" },
  ]

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline">
          <FilterIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <Form {...form}>
          <form className="space-y-4">
            <h3 className="text-lg font-semibold">Filters</h3>

            {/* Start Date Range */}
            <FormField
              control={form.control}
              name="startDateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date)
                          setStartDateOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date Range */}
            <FormField
              control={form.control}
              name="endDateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date (Optional)</FormLabel>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date)
                          setEndDateOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Format Checkboxes */}
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Format</FormLabel>
                  <div className="space-y-2">
                    {formatOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={field.value?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || []
                            const newValue = checked
                              ? [...currentValue, option.value]
                              : currentValue.filter((v) => v !== option.value)
                            field.onChange(newValue)
                          }}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expected Attendees Min */}
            <FormField
              control={form.control}
              name="expectedAttendeesMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Expected Attendees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Min attendees"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expected Attendees Max */}
            <FormField
              control={form.control}
              name="expectedAttendeesMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Expected Attendees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Max attendees"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Name Query */}
            <FormField
              control={form.control}
              name="eventNameQuery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search Event Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Search by event name..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reset Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                const newObj = {
                  limit: filters.limit,
                  page: filters.page,
                  ...defaultFilters,
                }
                setFilters(newObj)
                form.reset(newObj)
              }}
            >
              Reset Filters
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
