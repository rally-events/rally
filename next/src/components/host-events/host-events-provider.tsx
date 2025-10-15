"use client"

import { UserInfo } from "@rally/api"
import { createContext, ReactNode, useContext, useMemo, useState } from "react"
import { api } from "@/lib/trpc/client"
import { searchEventsSchema } from "@rally/schemas"
import { z } from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { AppRouter } from "@rally/api"
import type { inferRouterOutputs } from "@trpc/server"

type RouterOutputs = inferRouterOutputs<AppRouter>
type EventSearchResult = RouterOutputs["event"]["searchEvents"]["events"]
type EventRow = EventSearchResult[number]

export const EVENT_HOST_TABLE_LIMIT = 12

export const defaultFilters = {
  startDateRange: undefined,
  endDateRange: undefined,
  format: ["in-person", "virtual", "hybrid", "unspecified"] as (
    | "in-person"
    | "virtual"
    | "hybrid"
    | "unspecified"
  )[],
  eventNameQuery: "",
  expectedAttendeesMin: undefined,
  expectedAttendeesMax: undefined,
  sortBy: undefined,
  sortOrder: undefined,
}

interface HostEventsContextType {
  // List data and state
  filters: z.infer<typeof searchEventsSchema>
  setFilters: React.Dispatch<React.SetStateAction<z.infer<typeof searchEventsSchema>>>
  listEvents: EventRow[]
  listEventsLoading: boolean
  totalCount: number

  // Calendar data and state
  currentDate: Date
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
  calendarEvents: EventRow[]
  calendarEventsLoading: boolean

  // Stats data
  stats: {
    totalCount: number
    upcomingCount: number
  }
  statsLoading: boolean
  upcomingEvents: EventRow[]
  upcomingEventsLoading: boolean

  // Mutations and handlers
  createEvent: () => void
  isCreateEventPending: boolean
  deleteEvent: (id: string) => void
  isDeleteEventPending: boolean
  handleFilterSubmit: (values: z.infer<typeof searchEventsSchema>) => void
  handleSortChange: (sortBy?: string, sortOrder?: "asc" | "desc") => void
  handlePageChange: (page: number) => void

  // Calendar navigation
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  goToToday: () => void
  canGoBack: boolean
  canGoForward: boolean
}

const HostEventsContext = createContext<HostEventsContextType | undefined>(undefined)

interface HostEventsProviderProps {
  children: ReactNode
  user: UserInfo
}

export default function HostEventsProvider({ children, user }: HostEventsProviderProps) {
  const router = useRouter()

  // List filters state
  const [filters, setFilters] = useState<z.infer<typeof searchEventsSchema>>({
    limit: EVENT_HOST_TABLE_LIMIT,
    page: 0,
    organizationId: user.organizationId!,
    ...defaultFilters,
  })

  // Calendar date state
  const [currentDate, setCurrentDate] = useState(new Date())

  const calendarData = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const minDate = new Date(currentYear - 5, 0, 1)
    const maxDate = new Date(currentYear + 5, 11, 31)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    return {
      organizationId: user.organizationId!,
      startDateRange: new Date(year, month, 1),
      endDateRange: new Date(year, month + 1, 0),
      canGoBack: new Date(year, month - 1, 1) >= minDate,
      canGoForward: new Date(year, month + 1, 1) <= maxDate,
    }
  }, [currentDate])

  const upcomingData = useMemo(() => {
    return {
      organizationId: user.organizationId!,
      startDateRange: new Date(),
      sortBy: "startDatetime" as any,
      sortOrder: "asc" as any,
      limit: 2,
    }
  }, [user.organizationId])

  // Queries
  const utils = api.useUtils()
  const { data: listEventsData, isLoading: listEventsLoading } =
    api.event.searchEvents.useQuery(filters)
  const { data: calendarEventsData, isLoading: calendarEventsLoading } =
    api.event.searchEvents.useQuery({
      organizationId: user.organizationId!,
      startDateRange: calendarData.startDateRange,
      endDateRange: calendarData.endDateRange,
    })
  const { data: statsData, isLoading: statsLoading } = api.event.getEventStats.useQuery()
  const { data: upcomingEventsData, isLoading: upcomingEventsLoading } =
    api.event.searchEvents.useQuery(upcomingData)

  // Mutations
  const { mutate: createEventMutation, isPending: isCreateEventPending } =
    api.event.createEvent.useMutation({
      onSuccess: (data) => {
        router.push(`/dashboard/event/${data}/edit`)
      },
      onError: (error) => {
        console.error("Couln't create event", error)
        toast.error("Something went wrong, please try again later")
      },
    })

  const { mutate: deleteEventMutation, isPending: isDeleteEventPending } =
    api.event.deleteEvent.useMutation({
      onMutate: async (variables) => {
        // Cancel outgoing refetches for all searchEvents queries
        await utils.event.searchEvents.cancel()

        // Snapshot the previous value
        const previousEvents = utils.event.searchEvents.getData(filters)

        // Optimistically update to remove the event
        utils.event.searchEvents.setData(filters, (old) => {
          if (!old) return old
          return {
            ...old,
            events: old.events.filter((event) => event.id !== variables.id),
            totalCount: old.totalCount - 1,
          }
        })

        return { previousEvents }
      },
      onError: (_, __, context) => {
        if (context?.previousEvents) {
          utils.event.searchEvents.setData(filters, context.previousEvents)
        }
        toast.error("Failed to delete event")
      },
      onSettled: () => {
        // Invalidate all searchEvents queries instead of just the filtered one
        utils.event.searchEvents.invalidate()
        // Also invalidate stats since total count changed
        utils.event.getEventStats.invalidate()
      },
    })

  // Handlers
  const handleFilterSubmit = (values: z.infer<typeof searchEventsSchema>) => {
    setFilters({
      limit: EVENT_HOST_TABLE_LIMIT,
      page: 0,
      organizationId: user.organizationId!,
      startDateRange: values.startDateRange,
      endDateRange: values.endDateRange,
      format: values.format,
      eventNameQuery: values.eventNameQuery,
      expectedAttendeesMin: values.expectedAttendeesMin,
      expectedAttendeesMax: values.expectedAttendeesMax,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    })
  }

  const handleSortChange = (sortBy?: string, sortOrder?: "asc" | "desc") => {
    setFilters((prev) => ({
      ...prev,
      page: 0,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }))
  }

  const createEvent = () => {
    createEventMutation()
  }

  const deleteEvent = (id: string) => {
    deleteEventMutation({ id })
  }

  // Calendar navigation
  const goToPreviousMonth = () => {
    if (calendarData.canGoBack) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }
  }

  const goToNextMonth = () => {
    if (calendarData.canGoForward) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const value: HostEventsContextType = {
    // List data and state
    filters,
    setFilters,
    listEvents: listEventsData?.events ?? [],
    listEventsLoading,
    totalCount: listEventsData?.totalCount ?? 0,

    // Calendar data and state
    currentDate,
    setCurrentDate,
    calendarEvents: calendarEventsData?.events ?? [],
    calendarEventsLoading,

    // Stats data
    stats: {
      totalCount: statsData?.totalCount ?? 0,
      upcomingCount: statsData?.upcomingCount ?? 0,
    },
    statsLoading,
    upcomingEvents: upcomingEventsData?.events ?? [],
    upcomingEventsLoading,

    // Mutations and handlers
    createEvent,
    isCreateEventPending,
    deleteEvent,
    isDeleteEventPending,
    handleFilterSubmit,
    handleSortChange,
    handlePageChange,

    // Calendar navigation
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    canGoBack: calendarData.canGoBack,
    canGoForward: calendarData.canGoForward,
  }

  return <HostEventsContext.Provider value={value}>{children}</HostEventsContext.Provider>
}

export function useHostEvents() {
  const context = useContext(HostEventsContext)
  if (context === undefined) {
    throw new Error("useHostEvents must be used within a HostEventsProvider")
  }
  return context
}
