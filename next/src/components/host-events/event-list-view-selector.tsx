"use client"

import { LayoutGridIcon, ListIcon } from "lucide-react"
import { useEffect, useRef } from "react"

interface EventListViewSelectorProps {
  currentView: "grid" | "list"
  setCurrentView: (view: "grid" | "list") => void
}

export default function EventListViewSelector({
  currentView,
  setCurrentView,
}: EventListViewSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const selectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const selectedElement = containerRef.current?.querySelector(
      `button[data-view="${currentView}"]`,
    )

    console.log(currentView)
    if (
      containerRef.current &&
      selectorRef.current &&
      selectedElement &&
      selectedElement instanceof HTMLElement
    ) {
      selectorRef.current.style.width = `${selectedElement.offsetWidth + 2}px`
      selectorRef.current.style.height = `${selectedElement.offsetHeight + 2}px`
      selectorRef.current.style.left = `${selectedElement.offsetLeft - 1}px`
    }
  }, [currentView])

  return (
    <div
      ref={containerRef}
      className="bg-accent relative z-0 flex items-center gap-2 rounded-md border"
    >
      <div
        ref={selectorRef}
        className="bg-secondary absolute -top-px rounded-md border transition-all duration-200"
      />
      <button
        onClick={() => setCurrentView("grid")}
        data-view="grid"
        className={`z-10 flex h-8.5 items-center gap-2 px-3 text-base ${currentView === "grid" ? "" : "cursor-pointer"}`}
      >
        Grid <LayoutGridIcon className="size-4" />
      </button>
      <button
        onClick={() => setCurrentView("list")}
        data-view="list"
        className={`z-10 flex h-8.5 items-center gap-2 px-3 text-base ${currentView === "list" ? "" : "cursor-pointer"}`}
      >
        List <ListIcon className="size-4" />
      </button>
    </div>
  )
}
