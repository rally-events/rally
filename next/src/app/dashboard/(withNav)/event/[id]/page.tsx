import { api } from "@/lib/trpc/server"
import { notFound } from "next/navigation"

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id) {
    notFound()
  }
  const caller = await api()
  const event = await caller.event.getEvent({
    id: id,
    withOrganization: true,
    withMedia: true,
  })

  if (!event || !event.organization) {
    notFound()
  }

  return <div>Viewing event {id}</div>
}
