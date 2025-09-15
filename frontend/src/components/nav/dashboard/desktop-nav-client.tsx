"use client"

import { Separator } from "@/components/ui/separator"
import {
  BriefcaseIcon,
  CalendarIcon,
  ChartBarIcon,
  HomeIcon,
  MessageCircleIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DesktopNavClient() {
  const pathname = usePathname()
  return (
    <div className="flex flex-col gap-2">
      <Link
        href="/dashboard/overview"
        className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-accent transition-colors duration-75"
      >
        <HomeIcon className="size-4" />
        <h2 className="text-sm font-semibold">Overview</h2>
      </Link>
      <Link
        href="/dashboard/overview"
        className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-accent transition-colors duration-75"
      >
        <CalendarIcon className="size-4" />
        <h2 className="text-sm font-semibold">Events</h2>
      </Link>
      <Link
        href="/dashboard/overview"
        className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-accent transition-colors duration-75"
      >
        <BriefcaseIcon className="size-4" />
        <h2 className="text-sm font-semibold">Sponsorship Requests</h2>
      </Link>
      <Link
        href="/dashboard/overview"
        className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-accent transition-colors duration-75"
      >
        <UsersIcon className="size-4" />
        <h2 className="text-sm font-semibold">Organization</h2>
      </Link>
      <Link
        href="/dashboard/overview"
        className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-accent transition-colors duration-75"
      >
        <MessageCircleIcon className="size-4" />
        <h2 className="text-sm font-semibold">Messages</h2>
      </Link>
      <Separator />
      <Link
        href="/dashboard/overview"
        className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-accent transition-colors duration-75"
      >
        <ChartBarIcon className="size-4" />
        <h2 className="text-sm font-semibold">Stats</h2>
      </Link>
      <Link
        href="/dashboard/overview"
        className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-accent transition-colors duration-75"
      >
        <SettingsIcon className="size-4" />
        <h2 className="text-sm font-semibold">Settings</h2>
      </Link>
    </div>
  )
}
