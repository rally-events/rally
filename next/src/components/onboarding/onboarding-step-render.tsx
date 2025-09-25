"use client"
import { useOnboardingForm } from "@/components/onboarding/onboarding-provider"
import OnboardingStep1 from "./onboarding-step-1"
import OnboardingStep2 from "./onboarding-step-2"
import OnboardingStep3 from "./onboarding-step-3"

export default function OnboardingStepRender() {
  const { currentStep } = useOnboardingForm()

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 />
      case 2:
        return <OnboardingStep2 />
      case 3:
        return <OnboardingStep3 />
      default:
        return <OnboardingStep1 />
    }
  }

  return <div className="bg-background min-h-screen px-4 py-12">{renderStep()}</div>
}
