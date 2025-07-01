"use client"

import { CalendarIcon, LayoutGridIcon, MessageCircleIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

export default function ClientNavigation() {
  const pathname = usePathname()
  const segment = pathname.split("/")[2]

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!divRef.current) return
    const activeDashNavTarget = document.querySelector(
      "[data-active-dash-nav-target=true]"
    ) as HTMLElement
    if (!activeDashNavTarget) return
    const activeDashNavTargetRect = activeDashNavTarget.getBoundingClientRect()
    divRef.current.style.width = `${activeDashNavTarget.clientWidth}px`
    divRef.current.style.left = `${activeDashNavTarget.clientLeft}px`
    divRef.current.style.top = `${activeDashNavTarget.offsetTop}px`
    divRef.current.style.height = `${activeDashNavTarget.clientHeight}px`
  }, [pathname])

  return (
    <div className="flex flex-col gap-0.5 relative">
      <div
        ref={divRef}
        className="bg-muted rounded-md absolute top-0 left-0 transition-all duration-150 z-0 pointer-events-none border"
      />
      <ClientNavigationItem
        href="/dashboard/overview"
        icon={<LayoutGridIcon className="h-6 w-6" />}
        label="Overview"
        isActive={segment === "overview"}
      />
      <ClientNavigationItem
        href="/dashboard/events"
        icon={<CalendarIcon className="h-6 w-6" />}
        label="Events"
        isActive={segment === "events"}
      />
      <ClientNavigationItem
        href="/dashboard/messages"
        icon={<MessageCircleIcon className="h-6 w-6" />}
        label="Messages"
        isActive={segment === "messages"}
        notificationCount={10}
      />
    </div>
  )
}

const ClientNavigationItem = ({
  href,
  icon,
  label,
  notificationCount,
  isActive,
}: {
  href: string
  icon: React.ReactNode
  label: string
  notificationCount?: number
  isActive?: boolean
}) => {
  return (
    <Link
      href={href}
      className={`${isActive ? "" : "hover:bg-muted text-foreground/80 [&_svg]:text-muted-foreground hover:text-foreground hover:[&_svg]:text-foreground"}  flex items-center justify-between p-2 rounded-md z-10 transition-colors duration-75`}
      data-active-dash-nav-target={isActive}
    >
      <span className="flex items-center gap-3">
        <div
          className={`${isActive ? "bg-primary/10" : ""} p-1.5 rounded border`}
        >
          {icon}
        </div>
        {label}
      </span>

      {notificationCount && (
        <span className="border p-1 rounded text-xs flex items-center justify-center h-6 w-6 bg-muted text-foreground/80 mr-2">
          {notificationCount > 9 ? "9+" : notificationCount}
        </span>
      )}
    </Link>
  )
}
