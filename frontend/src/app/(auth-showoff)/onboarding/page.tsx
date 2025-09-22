import OnboardingProvider from "@/components/onboarding/onboarding-provider"
import OnboardingStepController from "@/components/onboarding/onboarding-step-controller"
import getUserInfo from "@/fetches/user/getUserInfo"
import React from "react"

export default async function page() {
  const { data, error } = await getUserInfo()
  if (error || !data) {
    return <div>Error: {error}</div>
  }
  return (
    <OnboardingProvider user={data}>
      <OnboardingStepController />
    </OnboardingProvider>
  )
}
