import { notFound } from "next/navigation"
import React from "react"

interface pageProps {
  params: Promise<{ id: string }>
}

export default async function page({ params }: pageProps) {
  const { id } = await params
  if (!id) {
    notFound()
  }
  return <div>You are viewing a sponsorship request</div>
}
