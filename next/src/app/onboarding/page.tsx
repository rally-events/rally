import React from "react"
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider"
import OnboardingStepRender from "../../components/onboarding/onboarding-step-render"

export default function page() {
  return (
    <OnboardingProvider>
      <OnboardingStepRender />
    </OnboardingProvider>
  )
}
