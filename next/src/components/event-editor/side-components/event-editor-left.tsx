import React from "react"
import { useEventEditor } from "../event-editor-provider"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import EventEditorSuggestions from "./event-editor-suggestions"

export default function EventEditorLeft() {
  const { currentTab, setCurrentTab } = useEventEditor()
  return (
    <>
      <Button
        variant="override"
        size="override"
        onClick={() => setCurrentTab("basics")}
        className={`${currentTab === "basics" ? "border-border bg-accent text-foreground font-medium tracking-[-0.0125em]" : "hover:bg-accent hover:text-foreground text-foreground/80 cursor-pointer border-transparent font-normal"} flex items-center justify-start gap-2 rounded-lg border p-2 transition-all duration-75`}
      >
        Basics
      </Button>
      <Button
        variant="override"
        size="override"
        onClick={() => setCurrentTab("media")}
        className={`${currentTab === "media" ? "border-border bg-accent text-foreground font-medium tracking-[-0.0125em]" : "hover:bg-accent hover:text-foreground text-foreground/80 cursor-pointer border-transparent font-normal"} flex items-center justify-start gap-2 rounded-lg border p-2 transition-all duration-75`}
      >
        Media
      </Button>
      <Button
        variant="override"
        size="override"
        onClick={() => setCurrentTab("attendees")}
        className={`${currentTab === "attendees" ? "border-border bg-accent text-foreground font-medium tracking-[-0.0125em]" : "hover:bg-accent hover:text-foreground text-foreground/80 cursor-pointer border-transparent font-normal"} flex items-center justify-start gap-2 rounded-lg border p-2 transition-all duration-75`}
      >
        Attendees
      </Button>
      <Button
        variant="override"
        size="override"
        onClick={() => setCurrentTab("sponsorship")}
        className={`${currentTab === "sponsorship" ? "border-border bg-accent text-foreground font-medium tracking-[-0.0125em]" : "hover:bg-accent hover:text-foreground text-foreground/80 cursor-pointer border-transparent font-normal"} flex items-center justify-start gap-2 rounded-lg border p-2 transition-all duration-75`}
      >
        Sponsorship
      </Button>
      <Separator className="my-1.5" />
      <EventEditorSuggestions />
    </>
  )
}
