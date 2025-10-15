import EventView from "@/components/event-view/event-view"
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
      id: id,
      withOrganization: true,
      withMedia: true,
    }),
    caller.user.getUserInfo(),
  ])

  if (!event || !event.organization) {
    notFound()
  }

  if (!user) {
    // TODO: redirect to public event view outside of dashboard
    notFound()
  }

  if (!user.supabaseMetadata.organization_type) {
    notFound()
  }

  return <EventView event={event} user={user} />
}
