import VerifyForm from "@/components/auth/verify-form"
import React from "react"

export default async function page({ searchParams }: { searchParams: Promise<{ code: string }> }) {
  const { code } = await searchParams
  return (
    <div className="flex flex-col items-center">
      <VerifyForm code={code} />
    </div>
  )
}
