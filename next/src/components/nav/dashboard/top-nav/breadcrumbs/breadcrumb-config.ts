"use client"
import { vanillaApi } from "@/lib/trpc/client"

export type BreadcrumbSegmentConfig = {
  label: string
  hide?: boolean
  redirect?: string
  dynamic?: {
    [key: string]: (id: string) => Promise<string>
  }
}

export type BreadcrumbConfig = {
  [segment: string]: BreadcrumbSegmentConfig
}

/**
 * Configuration for breadcrumb display
 * Maps route segments to their display labels and dynamic fetchers
 */
export const breadcrumbConfig: BreadcrumbConfig = {
  // Top level sections
  host: { label: "Host", hide: true },
  sponsor: { label: "Sponsor", hide: true },
  overview: { label: "Overview" },
  chats: { label: "Chats" },
  documents: { label: "Documents" },
  organization: { label: "Organization" },
  settings: { label: "Settings" },
  stats: { label: "Stats" },

  // Events
  events: { label: "Events" },
  event: {
    label: "Event",
    redirect: "/dashboard/host/events",
    dynamic: {
      "[id]": async (id: string) => {
        try {
          const event = await vanillaApi.event.getEvent.query({
            id,
            withOrganization: false,
            withMedia: false,
          })
          return event?.name || "Event"
        } catch (error) {
          console.error("Failed to fetch event name:", error)
          return "Event"
        }
      },
    },
  },

  // Sponsorships
  sponsorships: {
    label: "Sponsorships",
    dynamic: {
      "[id]": async (id: string) => {
        try {
          const event = await vanillaApi.event.getEvent.query({ id })
          return event?.name || "Sponsorship"
        } catch (error) {
          console.error("Failed to fetch sponsorship name:", error)
          return "Sponsorship"
        }
      },
    },
  },

  // Actions
  view: { label: "View" },
  edit: { label: "Edit" },
  create: { label: "Create" },
}

/**
 * Segments to skip when building breadcrumbs
 * These are Next.js route groups and utility segments
 */
export const skipSegments = ["dashboard", "(withNav)"]
