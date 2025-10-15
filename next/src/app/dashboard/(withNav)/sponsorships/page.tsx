import { api } from "@/lib/trpc/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import React from "react"

export default async function page() {
  const caller = await api()
  const user = await caller.user.getUserInfo()
  if (!user || !user.organizationId) {
    notFound()
  }
  const sponsorRequests = await caller.sponsorship.getSponsorRequests({
    organizationId: user.organizationId,
  })
  return (
    <div>
      <h1>Sponsorships</h1>
      <div>
        {sponsorRequests.map((sponsorRequest) => (
          <Link key={sponsorRequest.id} href={`/dashboard/sponsorships/${sponsorRequest.id}`}>
            {sponsorRequest.eventId}
          </Link>
        ))}
      </div>
    </div>
  )
}
