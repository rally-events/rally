import React from "react"
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider"
import { Step1 } from "./components/step-1"

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-background py-12 px-4">
        <Step1 />
      </div>
    </OnboardingProvider>
  )
}
