"use client"

import { createClient } from "@/utils/supabase/client"
import { UserInfo } from "@rally/api"
import React from "react"

interface EmailChangeProps {
  user: UserInfo
}

export default function EmailChange({ user }: EmailChangeProps) {
  const supabase = createClient()
  // TODO: Update email change to need 2fa once it is built
  return (
    <div>
      <div>email-change</div>
    </div>
  )
}
