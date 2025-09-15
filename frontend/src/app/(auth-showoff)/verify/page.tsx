import VerifyForm from "@/components/auth/verify-form"
import React from "react"

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ code: string }>
}) {
  const { code } = await searchParams
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-medium leading-tight">Welcome to Rally!</h1>
      <p className="text-muted-foreground leading-tight mb-8 max-w-sm text-center">
        Use the code sent to your email to verify your account and continue to
        Rally
      </p>
      <VerifyForm code={code} />
    </div>
  )
}
