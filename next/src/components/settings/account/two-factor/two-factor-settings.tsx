import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { UserInfo } from "@rally/api"
import { MailIcon, PhoneIcon, VaultIcon } from "lucide-react"
import React, { Dispatch, SetStateAction } from "react"
import VerifyEmailModal from "./verify-email-modal"
import { Badge } from "@/components/ui/badge"
import PhoneControls from "./phone-controls"

interface TwoFactorSettingsProps {
  userInfo: UserInfo<{ withChallenges: true }>
  setUserInfo: Dispatch<SetStateAction<UserInfo<{ withChallenges: true }>>>
}
export default function TwoFactorSettings({ userInfo, setUserInfo }: TwoFactorSettingsProps) {
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
                className={`rounded-md border p-2 ${userInfo.supabaseMetadata.is_phone_verified ? "border-success" : userInfo.supabaseMetadata.phone_number ? "border-warning" : ""}`}
              >
                <MailIcon className="size-5" />
              </div>
              <div className="flex flex-col">
                <p className="inline-flex items-center gap-1 leading-tight font-medium">
                  Email
                  {userInfo.supabaseMetadata.email && (
                    <>
                      {!userInfo.supabaseMetadata.is_email_verified && (
                        <Badge size="sm" variant="destructive">
                          Not verified
                        </Badge>
                      )}
                      {userInfo.supabaseMetadata.is_email_verified && (
                        <Badge size="sm" variant="success">
                          Verified
                        </Badge>
                      )}
                    </>
                  )}
                </p>
                <span>
                  <p className="text-muted-foreground text-sm leading-tight">
                    {userInfo.supabaseMetadata.email}
                  </p>
                </span>
              </div>
            </div>
            {userInfo.supabaseMetadata.is_email_verified ? (
              <>{/* TODO: Add support for changing emails */}</>
            ) : (
              <VerifyEmailModal user={userInfo} />
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`rounded-md border p-2 ${userInfo.supabaseMetadata.is_phone_verified ? "border-success" : userInfo.supabaseMetadata.phone_number ? "border-warning" : ""}`}
              >
                <PhoneIcon className="size-5" />
              </div>
              <div className="flex flex-col">
                <p className="inline-flex items-center gap-1 leading-tight font-medium">
                  Phone Number
                  {userInfo.supabaseMetadata.phone_number && (
                    <>
                      {!userInfo.supabaseMetadata.is_phone_verified && (
                        <Badge size="sm" variant="destructive">
                          Not verified
                        </Badge>
                      )}
                      {userInfo.supabaseMetadata.is_phone_verified && (
                        <Badge size="sm" variant="success">
                          Verified
                        </Badge>
                      )}
                    </>
                  )}
                </p>
                <span>
                  <p className="text-muted-foreground text-sm leading-tight">
                    {userInfo.supabaseMetadata.phone_number ?? "Not setup"}
                  </p>
                </span>
              </div>
            </div>
            <PhoneControls userInfo={userInfo} setUserInfo={setUserInfo} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`rounded-md border p-2 ${userInfo.supabaseMetadata.is_phone_verified ? "border-success" : userInfo.supabaseMetadata.phone_number ? "border-warning" : ""}`}
              >
                <VaultIcon className="size-5" />
              </div>
              <div className="flex flex-col">
                <p className="inline-flex items-center gap-1 leading-tight font-medium">
                  Authenticator App
                </p>
              </div>
            </div>
            {/* TODO: Add authenticator app flow */}
            <Button variant="outline">Add Authenticator App</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
