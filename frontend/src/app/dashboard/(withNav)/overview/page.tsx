"use client"
import { Button } from "@/components/ui/button"

import sendSignupEmail from "@/mutations/email/sendVerificationEmail"
import { createClient } from "@/utils/supabase/client"
import React from "react"

export default function page() {
  const signOut = () => {
    const client = createClient()
    client.auth.signOut()
  }

  return (
    <div className="flex flex-col gap-4 p-12">
      <Button
        onClick={() => {
          sendSignupEmail(
            "dclerici77@gmail.com",
            "Dominic",
            "Clerici",
            "123456"
          )
        }}
      >
        Test confirmation email
      </Button>

      <Button
        onClick={() => {
          signOut()
        }}
      >
        Sign out
      </Button>
    </div>
  )
}
