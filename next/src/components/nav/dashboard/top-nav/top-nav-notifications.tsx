"use client"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BellIcon } from "lucide-react"
import React, { useState } from "react"

export default function TopNavNotifications() {
  const EXAMPLE_NUMBER = 2
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="override" className="h-10 w-10">
          <span className="relative">
            {EXAMPLE_NUMBER > 0 && (
              <span className="bg-primary text-primary-foreground pointer-events-none absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full font-mono text-[10px] leading-none">
                {EXAMPLE_NUMBER > 9 ? "9+" : EXAMPLE_NUMBER}
              </span>
            )}
            <BellIcon className="size-4" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div>Notifications</div>
        <p>they will be here once we build that feature</p>
      </PopoverContent>
    </Popover>
  )
}
