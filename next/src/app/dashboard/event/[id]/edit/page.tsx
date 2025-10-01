import EventEditorDisplay from "@/components/event-editor/event-editor-display"
import EventEditorProvider from "@/components/event-editor/event-editor-provider"
import { api } from "@/lib/trpc/server"
import { notFound } from "next/navigation"

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id) {
    notFound()
  }
  const caller = await api()
  const [event, user] = await Promise.all([
    caller.event.getEvent({
      id,
      withMedia: true,
      withUpdatedByUser: true,
    }),
    caller.user.getUserInfo({ withOrganization: true }),
  ])
  if (!user || !event) {
    notFound()
  }
  if (user.organizationId !== event.organizationId || !user.organization) {
    notFound()
  }
  console.log(event.updatedByUser)
  return (
    <EventEditorProvider event={event} userInfo={user}>
      <EventEditorDisplay />
    </EventEditorProvider>
  )
}
