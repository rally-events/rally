"use client"
import { ChevronDownIcon } from "lucide-react"
import React, { useState } from "react"
import styles from "./event-editor-suggestions.module.css"
import { Progress } from "@/components/ui/progress"

const suggestions = [
  {
    id: 1,
    name: "Suggestion 1",
  },
  {
    id: 2,
    name: "Suggestion 2",
  },
  {
    id: 3,
    name: "Suggestion 3",
  },
  {
    id: 4,
    name: "Suggestion 4",
  },
]

export default function EventEditorSuggestions() {
  const [open, setOpen] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  const handleOpenChange = () => {
    if (isClosing) return

    if (open) {
      setIsClosing(true)
      setTimeout(() => {
        setIsClosing(false)
        setOpen(false)
      }, 300)
    } else {
      setOpen(true)
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      <button
        className="hover:bg-accent hover:text-foreground text-muted-foreground flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1 text-sm"
        onClick={handleOpenChange}
      >
        3 Suggestions
        <ChevronDownIcon
          className={`size-4 shrink-0 ${open ? "rotate-180" : ""} transition-transform duration-150`}
        />
      </button>
      {(open || isClosing) && (
        <div className="flex flex-col gap-1">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              style={{
                animationDelay: `${(index / (suggestions.length - 1)) * 150}ms`,
                transform: `translateY(${isClosing ? 0.3 : 0}rem)`,
                opacity: isClosing ? 0 : 1,
                transition: `background-color 150ms ease-out, color 150ms ease-out, transform 150ms ${((suggestions.length - index) / suggestions.length) * 150}ms ease-out, opacity 150ms ${((suggestions.length - index) / suggestions.length) * 150}ms ease-out`,
              }}
              className={`hover:bg-accent hover:text-foreground text-muted-foreground flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1 text-sm ${styles.editorSuggestion}`}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
