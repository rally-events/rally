"use client"

import { UserInfo } from "@rally/api"
import React, { useState } from "react"
import ProfileUpdate from "./profile-update"
import TwoFactorSettings from "./two-factor/two-factor-settings"
import { Separator } from "@/components/ui/separator"

interface AccountSettingsProps {
  user: UserInfo<{
    withChallenges: true
  }>
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [userInfo, setUserInfo] = useState<UserInfo<{ withChallenges: true }>>(user)
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Account & Security</h1>
      <Separator />
      <ProfileUpdate user={userInfo} />
      <TwoFactorSettings userInfo={userInfo} setUserInfo={setUserInfo} />
    </div>
  )
}
