"use client"
import React, { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { FilterIcon } from "lucide-react"
import { Button } from "../ui/button"
import z from "zod"
import { searchEventsSchema } from "@rally/schemas"

interface HostEventListFiltersProps {
  filters: z.infer<typeof searchEventsSchema>
  setFilters: React.Dispatch<React.SetStateAction<z.infer<typeof searchEventsSchema>>>
}

export default function HostEventListFilters({ filters, setFilters }: HostEventListFiltersProps) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline">
          <FilterIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <h3>Filters</h3>
        </div>
      </PopoverContent>
    </Popover>
  )
}
