"use client"

import { UserInfo } from "@rally/api"
import React from "react"
import ProfileUpdate from "./profile-update"
import EmailChange from "./email-change"
import TwoFactorSettings from "./two-factor/two-factor-settings"
import { Separator } from "@/components/ui/separator"

interface AccountSettingsProps {
  user: UserInfo
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Account & Security</h1>
      <Separator />
      <ProfileUpdate user={user} />
      <TwoFactorSettings user={user} />
      <EmailChange user={user} />
    </div>
  )
}
