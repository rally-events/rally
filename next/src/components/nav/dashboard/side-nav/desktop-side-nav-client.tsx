"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/trpc/client"
import {
  BriefcaseIcon,
  CalendarIcon,
  ChartBarIcon,
  HomeIcon,
  MessageCircleIcon,
  PartyPopperIcon,
  PlusIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React, { ComponentType, JSXElementConstructor, SVGProps, useState } from "react"
import { toast } from "sonner"

const sponsorLinks = [
  {
    href: "/dashboard/sponsor/events",
    icon: CalendarIcon,
    label: "Find Events",
  },
  {
    href: "/dashboard/documents",
    icon: BriefcaseIcon,
    label: "Documents",
  },
]

const hostLinks = [
  {
    href: "/dashboard/host/events",
    icon: PartyPopperIcon,
    label: "Events",
  },
  {
    href: "/dashboard/sponsorship-requests",
    icon: BriefcaseIcon,
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
        Icon={HomeIcon}
        isActive={pathname.startsWith("/dashboard/overview")}
        label="Overview"
      />
      {organizationType === "host" &&
        hostLinks.map((link) => (
          <ClientLink
            key={link.href}
            href={link.href}
            Icon={link.icon}
            label={link.label}
            isActive={pathname.startsWith(link.href)}
          />
        ))}
      {organizationType === "sponsor" &&
        sponsorLinks.map((link) => (
          <ClientLink
            key={link.href}
            href={link.href}
            Icon={link.icon}
            label={link.label}
            isActive={pathname.startsWith(link.href)}
          />
        ))}

      <ClientLink
        href="/dashboard/organization"
        Icon={UsersIcon}
        isActive={pathname.startsWith("/dashboard/organization")}
        label="Organization"
      />
      <ClientLink
        href="/dashboard/chat"
        Icon={MessageCircleIcon}
        isActive={pathname.startsWith("/dashboard/chat")}
        label="Chats"
      />
      <Separator />
      <ClientLink
        href="/dashboard/stats"
        Icon={ChartBarIcon}
        isActive={pathname.startsWith("/dashboard/stats")}
        label="Stats"
      />
      <ClientLink
        href="/dashboard/settings"
        Icon={SettingsIcon}
        isActive={pathname.startsWith("/dashboard/settings")}
        label="Settings"
      />
    </>
  )
}

interface ClientLinkProps {
  href: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  isActive: boolean
}

const ClientLink = ({ href, Icon, label, isActive }: ClientLinkProps) => {
  return (
    <Link
      href={href}
      className={`${isActive ? "border-border bg-accent text-foreground font-medium tracking-[-0.0125em]" : "hover:bg-accent hover:text-foreground text-foreground/80 border-transparent"} flex items-center gap-2 rounded-lg border px-4 py-2 transition-all duration-75`}
    >
      <Icon className="size-4" />
      <h2 className="text-sm">{label}</h2>
    </Link>
  )
}

export const HostCreateEvent = () => {
  const router = useRouter()
  const { mutate: createEvent, isPending } = api.event.createEvent.useMutation({
    onSuccess: (data) => {
      router.push(`/dashboard/event/${data}/edit`)
    },
    onError: (error) => {
      console.error("Couln't create event", error)
      toast.error("Something went wrong, please try again later")
    },
  })

  return (
    <Button
      className="h-9.5 w-full justify-start px-4"
      size="override"
      isLoading={isPending}
      onClick={() => createEvent()}
    >
      <PlusIcon className="size-4" />
      Create Event
    </Button>
  )
}
