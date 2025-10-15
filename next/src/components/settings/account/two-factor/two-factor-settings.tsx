import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { UserInfo } from "@rally/api"
import { MailIcon, PhoneIcon, VaultIcon } from "lucide-react"
import React from "react"
import VerifyEmailModal from "./verify-email-modal"
import AddPhoneModal from "./add-phone-modal"
import RemovePhoneModal from "./remove-phone-modal"

interface TwoFactorSettingsProps {
  user: UserInfo
}

export default function TwoFactorSettings({ user }: TwoFactorSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Factor Authentication</CardTitle>
        <CardDescription>Add an additional layer of security to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`rounded-md border p-2 ${user.supabaseMetadata.is_phone_verified ? "border-success" : user.supabaseMetadata.phone_number ? "border-warning" : ""}`}
              >
                <MailIcon className="size-5" />
              </div>
              <div className="flex flex-col">
                <p className="leading-tight font-medium">Email</p>
                <span>
                  <p className="text-muted-foreground text-sm leading-tight">
                    {user.supabaseMetadata.email ? (
                      <>
                        {user.supabaseMetadata.email}
                        {!user.supabaseMetadata.is_email_verified && " (Not verified)"}
                      </>
                    ) : (
                      "Not verified"
                    )}
                  </p>
                </span>
              </div>
            </div>
            {user.supabaseMetadata.is_email_verified ? (
              <>{/* TODO: change email flow */}</>
            ) : (
              <VerifyEmailModal user={user} />
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`rounded-md border p-2 ${user.supabaseMetadata.is_phone_verified ? "border-success" : user.supabaseMetadata.phone_number ? "border-warning" : ""}`}
              >
                <PhoneIcon className="size-5" />
              </div>
              <div className="flex flex-col">
                <p className="leading-tight font-medium">Phone Number</p>
                <span>
                  <p className="text-muted-foreground text-sm leading-tight">
                    {user.supabaseMetadata.phone_number ? (
                      <>
                        {user.supabaseMetadata.phone_number}
                        {!user.supabaseMetadata.is_phone_verified && " (Not verified)"}
                      </>
                    ) : (
                      "Not setup"
                    )}
                  </p>
                </span>
              </div>
            </div>
            {user.supabaseMetadata.is_phone_verified ? (
              <RemovePhoneModal user={user} />
            ) : (
              <AddPhoneModal user={user} />
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`rounded-md border p-2 ${user.supabaseMetadata.is_phone_verified ? "border-success" : user.supabaseMetadata.phone_number ? "border-warning" : ""}`}
              >
                <VaultIcon className="size-5" />
              </div>
              <div className="flex flex-col">
                <p className="leading-tight font-medium">Authenticator App</p>
                <span>
                  <p className="text-muted-foreground text-sm leading-tight">Not setup</p>
                </span>
              </div>
            </div>
            <Button variant="outline">Add Authenticator App</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
