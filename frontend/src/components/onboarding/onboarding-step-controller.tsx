"use client"
import React from "react"
import { useOnboarding } from "./onboarding-provider"
import OnboardingStep1 from "./onboarding-step-1"
import { Separator } from "../ui/separator"

export default function OnboardingStepController() {
  const { step, handleStepChange } = useOnboarding()
  return (
    <main className="mt-20 flex flex-grow-1 flex-col gap-4">
      <div className="flex flex-col">
        <h2 className="text-3xl font-medium">Welcome to Rally</h2>
        <p className="text-muted-foreground">
          We just need a few more details to get you set up with Rally
        </p>
        <StepIndicator value={(step / 6) * 100} />
      </div>
      <Separator />
      {step === 1 && <OnboardingStep1 />}
    </main>
  )
}

const StepIndicator = ({ value }: { value: number }) => {
  return (
    <div className="bg-primary/20 relative h-2 w-full overflow-hidden rounded-full">
      <div
        className="bg-primary h-full w-full flex-1 rounded-full transition-all duration-300"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
}
