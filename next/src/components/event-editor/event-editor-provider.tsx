"use client"
import { EventInfo, MediaInfo, UserInfo } from "@rally/api"
import { eventEditOptionalSchema } from "@rally/schemas"
import React, { createContext, useContext, useState, useRef, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { formatDefaultValues } from "./event-editor-utils"
import { api } from "@/lib/trpc/client"
import { toast } from "sonner"

const EventEditorContext = createContext<EventEditorContextType | undefined>(undefined)

export type EventEditorTabOptions = "basics" | "media" | "attendees" | "sponsorship"

export type EventEditorContextType = {
  currentTab: EventEditorTabOptions
  setCurrentTab: (tab: EventEditorTabOptions) => void
  event: EventInfo<{ withOrganization: true }>
  uploadedMedia: MediaInfo[]
  setUploadedMedia: React.Dispatch<React.SetStateAction<MediaInfo[]>>
  lastUpdated: Date
  userInfo: UserInfo
  saveStatus: "saving" | "saved" | "error"
  generateUploadUrl: ReturnType<typeof api.media.generateUploadUrl.useMutation>
  confirmUpload: ReturnType<typeof api.media.confirmUpload.useMutation>
  deleteMedia: ReturnType<typeof api.media.deleteMedia.useMutation>
  isDirty: boolean
}

export type EventEditSchema = z.infer<typeof eventEditOptionalSchema>

export default function EventEditorProvider({
  children,
  event,
  userInfo,
}: {
  children: React.ReactNode
  event: EventInfo<{ withOrganization: true; withMedia: true }>
  userInfo: UserInfo
}) {
  const form = useForm<EventEditSchema>({
    defaultValues: formatDefaultValues(event),
    resolver: zodResolver(eventEditOptionalSchema),
  })
  const [currentTab, setCurrentTab] = useState<EventEditorTabOptions>("basics")
  const [uploadedMedia, setUploadedMedia] = useState<MediaInfo[]>(event.media)
  const [lastUpdated, setLastUpdated] = useState(event.updatedAt)
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "error">("saved")

  const generateUploadUrl = api.media.generateUploadUrl.useMutation()
  const confirmUpload = api.media.confirmUpload.useMutation()
  const deleteMedia = api.media.deleteMedia.useMutation()

  // autosave
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasUnsavedChangesRef = useRef(false)
  const updateEventMutation = api.event.updateEvent.useMutation()

  useEffect(() => {
    const subscription = form.watch((data, { name }) => {
      // Skip if no field name (initial call)
      if (!name) return

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      setSaveStatus("saving")

      // Set new timeout for autosave
      saveTimeoutRef.current = setTimeout(async () => {
        // Only save if form is valid
        const isValid = await form.trigger()
        if (!isValid) {
          console.error("[EventEditor] Autosave failed", form.formState.errors)
          setSaveStatus("error")
          return
        }

        try {
          const formData = form.getValues()
          await updateEventMutation.mutateAsync({
            ...formData,
          })

          form.reset(formData, { keepValues: true })

          setSaveStatus("saved")
          setLastUpdated(new Date())
        } catch (error) {
          console.error("[EventEditor] Autosave failed", error)
          setSaveStatus("error")
        }
      }, 3000)
    })

    return () => {
      console.log("[EventEditor] Unsubscribing from autosave")
      subscription.unsubscribe()
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [event.id, form.trigger])

  // Browser warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault()
        return "You have unsaved changes. Are you sure you want to leave?"
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
        event,
        uploadedMedia,
        setUploadedMedia,
        lastUpdated,
        userInfo,
        saveStatus,
        generateUploadUrl,
        confirmUpload,
        deleteMedia,
        isDirty: form.formState.isDirty,
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
