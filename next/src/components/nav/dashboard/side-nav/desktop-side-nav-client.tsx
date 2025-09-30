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

const sponsorLinks = [
  {
    href: "/dashboard/sponsor/events",
    icon: <CalendarIcon className="size-4" />,
    label: "Find Events",
  },
  {
    href: "/dashboard/documents",
    icon: <BriefcaseIcon className="size-4" />,
    label: "Documents",
  },
]

const hostLinks = [
  {
    href: "/dashboard/host/events",
    icon: <HomeIcon className="size-4" />,
    label: "Events",
  },
  {
    href: "/dashboard/sponsorship-requests",
    icon: <BriefcaseIcon className="size-4" />,
    label: "Sponsorship Requests",
  },
]

interface DesktopNavClientProps {
  organizationType: "host" | "sponsor"
}

export default function DesktopNavClient({ organizationType }: DesktopNavClientProps) {
  const pathname = usePathname()
  return (
    <>
      <ClientLink
        href="/dashboard/overview"
        icon={<HomeIcon className="size-4" />}
        label="Overview"
      />
      {organizationType === "host" &&
        hostLinks.map((link) => (
          <ClientLink key={link.href} href={link.href} icon={link.icon} label={link.label} />
        ))}
      {organizationType === "sponsor" &&
        sponsorLinks.map((link) => (
          <ClientLink key={link.href} href={link.href} icon={link.icon} label={link.label} />
        ))}

      <ClientLink
        href="/dashboard/organization"
        icon={<UsersIcon className="size-4" />}
        label="Organization"
      />
      <ClientLink
        href="/dashboard/chat"
        icon={<MessageCircleIcon className="size-4" />}
        label="Chats"
      />
      <Separator />
      <ClientLink
        href="/dashboard/stats"
        icon={<ChartBarIcon className="size-4" />}
        label="Stats"
      />
      <ClientLink
        href="/dashboard/settings"
        icon={<SettingsIcon className="size-4" />}
        label="Settings"
      />
    </>
  )
}

interface ClientLinkProps {
  href: string
  icon: React.ReactNode
  label: string
}

const ClientLink = ({ href, icon, label }: ClientLinkProps) => {
  return (
    <Link
      href={href}
      className="hover:bg-accent flex items-center gap-2 rounded-lg px-4 py-2 transition-colors duration-75"
    >
      {icon}
      <h2 className="text-sm font-semibold">{label}</h2>
    </Link>
  )
}
