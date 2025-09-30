"use client"
import { EventInfo } from "@rally/api"
import { eventEditSchema } from "@rally/schemas"
import React, { useState } from "react"
import z from "zod"

export type EventEditSchema = z.infer<typeof eventEditSchema>

export default function EventEditorProvider({
  children,
  event,
}: {
  children: React.ReactNode
  event: EventInfo
}) {
  const [formValues, setFormValues] = useState<EventEditSchema>(event)
  return <div>event-editor-provider</div>
}
