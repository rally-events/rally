"use client"
import { EventInfo, UserInfo } from "@rally/api"
import { eventEditSchema, eventEditOptionalSchema } from "@rally/schemas"
import React, { createContext, useContext, useState } from "react"
import { FormProvider, useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

const EventEditorContext = createContext<EventEditorContextType | undefined>(undefined)

export type EventEditorTabOptions = "basics" | "media" | "attendees" | "sponsorship"

export interface UploadedMedia {
  id: string
  url: string
  type: "image" | "video"
  fileName: string
  fileSize: number
}

export type EventEditorContextType = {
  currentTab: EventEditorTabOptions
  setCurrentTab: (tab: EventEditorTabOptions) => void
  organization: NonNullable<UserInfo["organization"]>
  eventId: string
  uploadedMedia: UploadedMedia[]
  setUploadedMedia: React.Dispatch<React.SetStateAction<UploadedMedia[]>>
}

export type EventEditSchema = z.infer<typeof eventEditOptionalSchema>

export default function EventEditorProvider({
  children,
  event,
  organization,
}: {
  children: React.ReactNode
  event: EventInfo
  organization: NonNullable<UserInfo["organization"]>
}) {
  const form = useForm<EventEditSchema>({
    defaultValues: event,
    resolver: zodResolver(eventEditOptionalSchema),
  })
  const [currentTab, setCurrentTab] = useState<EventEditorTabOptions>("basics")
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([])

  return (
    <EventEditorContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        organization,
        eventId: event.id,
        uploadedMedia,
        setUploadedMedia,
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
