"use client"
import { EventInfo, UserInfo } from "@rally/api"
import { eventEditOptionalSchema } from "@rally/schemas"
import React, { createContext, useContext, useState, useRef, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { formatDefaultValues } from "./event-editor-utils"
import { api } from "@/lib/trpc/client"

const EventEditorContext = createContext<EventEditorContextType | undefined>(undefined)

export type EventEditorTabOptions = "basics" | "media" | "attendees" | "sponsorship"

export interface UploadedMedia {
  id: string
  url: string
  type: "image" | "video" | "poster" | "pdf"
  fileName: string
  fileSize: number
}

export type EventEditorContextType = {
  currentTab: EventEditorTabOptions
  setCurrentTab: (tab: EventEditorTabOptions) => void
  eventId: string
  uploadedMedia: UploadedMedia[]
  setUploadedMedia: React.Dispatch<React.SetStateAction<UploadedMedia[]>>
  eventData: EventInfo<{ withMedia: true; withUpdatedByUser: true }>
  userInfo: UserInfo<{ withOrganization: true }>
}

export type EventEditSchema = z.infer<typeof eventEditOptionalSchema>

export default function EventEditorProvider({
  children,
  event,
  userInfo,
}: {
  children: React.ReactNode
  event: EventInfo<{ withMedia: true; withUpdatedByUser: true }>
  userInfo: UserInfo<{ withOrganization: true }>
}) {
  const form = useForm<EventEditSchema>({
    defaultValues: formatDefaultValues(event),
    resolver: zodResolver(eventEditOptionalSchema),
  })
  const [currentTab, setCurrentTab] = useState<EventEditorTabOptions>("basics")
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([])
  const [eventData, setEventData] =
    useState<EventInfo<{ withMedia: true; withUpdatedByUser: true }>>(event)

  // Autosave functionality
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasUnsavedChangesRef = useRef(false)
  const updateEventMutation = api.event.updateEvent.useMutation()

  // Watch form changes
  useEffect(() => {
    const subscription = form.watch((data, { name }) => {
      // Skip if no field name (initial call)
      if (!name) return

      // Mark as having unsaved changes
      hasUnsavedChangesRef.current = true

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Set new timeout for autosave
      saveTimeoutRef.current = setTimeout(async () => {
        // Only save if form is valid
        const isValid = await form.trigger()
        if (!isValid) {
          console.log("[EventEditor] Skipping autosave - form validation failed")
          return
        }

        try {
          const formData = form.getValues()
          await updateEventMutation.mutateAsync({
            ...formData,
          })

          // Reset form state to clean after successful save
          form.reset(formData, { keepValues: true })
          hasUnsavedChangesRef.current = false
          console.log("[EventEditor] Autosaved successfully")
        } catch (error) {
          console.error("[EventEditor] Autosave failed", error)
        }
      }, 3000)
    })

    return () => {
      subscription.unsubscribe()
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [form, event.id, updateEventMutation])

  // Browser warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChangesRef.current) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  return (
    <EventEditorContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        eventId: event.id,
        uploadedMedia,
        setUploadedMedia,
        eventData,
        userInfo,
      }}
    >
      <FormProvider {...form}>{children}</FormProvider>
    </EventEditorContext.Provider>
  )
}

export const useEventEditor = () => {
  const context = useContext(EventEditorContext)
  if (!context) {
    throw new Error("useEventEditor must be used within an EventEditorProvider")
  }
  return context
}
