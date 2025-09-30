"use client"

import { useEffect, useState } from "react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TopNavSearch() {
  const [open, setOpen] = useState<boolean>(false)
  const [isMac, setIsMac] = useState<boolean>(true)

  useEffect(() => {
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent))
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <div className="w-full">
        <Button
          variant="outline"
          size="override"
          onClick={() => setOpen(true)}
          className="h-8 w-64 pr-1.5 pl-3"
        >
          <span className="flex w-full items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-2 text-sm font-normal">
              <SearchIcon className="size-4" /> Search
            </span>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <kbd className="bg-muted pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono font-medium select-none">
                {isMac ? "⌘" : "ctrl"}
              </kbd>
              <span className="leading-none">+</span>
              <kbd className="bg-muted pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono font-medium select-none">
                K
              </kbd>
            </span>
          </span>
        </Button>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>Profile</CommandItem>
            <CommandItem>Billing</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
