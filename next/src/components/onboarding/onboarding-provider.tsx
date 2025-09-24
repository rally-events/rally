"use client"
import { fullOptionalSchema } from "@/schemas/auth/onboarding-schemas"
import { UserInfo } from "@/types/user-types"
import { useRouter, useSearchParams } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import z from "zod"

type OnboardingContextType = {
  formValues: z.infer<typeof fullOptionalSchema>
  setFormValues: React.Dispatch<React.SetStateAction<z.infer<typeof fullOptionalSchema>>>
  step: number
  handleStepChange: (step: number) => void
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export default function OnboardingProvider({
  children,
  user,
}: {
  children: React.ReactNode
  user: UserInfo
}) {
  const [formValues, setFormValues] = useState<z.infer<typeof fullOptionalSchema>>({
    hostOrSponsor: "",
    companyCategory: "",
  })
  const [step, setStep] = useState(1)
  const searchParams = useSearchParams()
  const router = useRouter()

  const paramStep = searchParams.get("step") || 1

  const handleStepChange = (step: number) => {
    setStep(step)
    router.push(`/onboarding?step=${step}`)
  }

  useEffect(() => {
    if (isNaN(parseInt(paramStep as string))) {
      handleStepChange(1)
    } else {
      if (parseInt(paramStep as string) >= 1 && parseInt(paramStep as string) <= 6) {
        handleStepChange(parseInt(paramStep as string))
      } else {
        handleStepChange(1)
      }
    }
  }, [paramStep])

  return (
    <OnboardingContext.Provider value={{ formValues, setFormValues, step, handleStepChange }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
