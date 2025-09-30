"use client"
import { EventInfo, UserInfo } from "@rally/api"
import { eventEditSchema, eventEditOptionalSchema } from "@rally/schemas"
import React, { createContext, useContext, useState } from "react"
import { FormProvider, useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

const EventEditorContext = createContext<EventEditorContextType | undefined>(undefined)

export type EventEditorTabOptions = "basics" | "media" | "attendees" | "sponsorship"

export type EventEditorContextType = {
  currentTab: EventEditorTabOptions
  setCurrentTab: (tab: EventEditorTabOptions) => void
  organization: NonNullable<UserInfo["organization"]>
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

  // const updateValues = (values: Partial<EventEditSchema>) => {
  //   const validationResult = eventEditOptionalSchema.safeParse(values)
  //   if (!validationResult.success) {
  //     console.log("inValid values:", validationResult.error)
  //     return
  //   }
  //   form.setValue(validationResult.data)
  // }

  return (
    <EventEditorContext.Provider value={{ currentTab, setCurrentTab, organization }}>
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
