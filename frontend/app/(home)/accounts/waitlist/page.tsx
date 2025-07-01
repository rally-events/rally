import React from "react"
import WaitlistForm from "@/features/home/waitlist/waitlist-form"

export default function WaitlistPage() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex flex-col items-center mt-36 gap-4">
        <h1 className="text-4xl font-bold">Join the waitlist</h1>
        <p className="text-muted-foreground">
          We're building Rally and we'd love you to be part of it.
        </p>
        <WaitlistForm />
      </div>
    </main>
  )
}
