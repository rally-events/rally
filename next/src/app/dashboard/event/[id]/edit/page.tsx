import EventEditorDisplay from "@/components/event-editor/event-editor-display"
import EventEditorProvider from "@/components/event-editor/event-editor-provider"
import { api } from "@/lib/trpc/server"
import { notFound } from "next/navigation"
import React, { use } from "react"

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id) {
    notFound()
  }
  const caller = await api()
  const [event, user] = await Promise.all([
    caller.event.getEvent({ id }),
    caller.user.getUserInfo(),
  ])
  if (!user || !event) {
    notFound()
  }
  if (user.organizationId !== event.organizationId) {
    notFound()
  }
  return (
    <EventEditorProvider event={event}>
      <EventEditorDisplay />
    </EventEditorProvider>
  )
}
