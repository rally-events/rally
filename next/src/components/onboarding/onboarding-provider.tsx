"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { onboardingFormOptionalSchema, onboardingFormSchema } from "@rally/schemas"
import z from "zod"

export type OnboardingFormOptional = z.infer<typeof onboardingFormOptionalSchema>
export type OnboardingForm = z.infer<typeof onboardingFormSchema>

interface OnboardingContextType {
  formValues: OnboardingFormOptional
  updateValues: (values: Partial<OnboardingFormOptional>, isSubmit?: boolean) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const STORAGE_KEY = "onboarding-form-values"

const defaultValues: OnboardingFormOptional = {
  organizationType: "",
  organizationName: "",
}

interface OnboardingProviderProps {
  children: ReactNode
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formValues, setFormValues] = useState<OnboardingFormOptional>(undefined)
  const [currentStep, setCurrentStepState] = useState<number>(1)

  useEffect(() => {
    const stepParam = searchParams.get("step")
    const stepNumber = stepParam ? parseInt(stepParam, 10) : 1

    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 3) {
      router.replace("/onboarding?step=1")
      setCurrentStepState(1)
    } else {
      setCurrentStepState(stepNumber)
    }
  }, [searchParams, router])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const validationResult = onboardingFormOptionalSchema.safeParse(JSON.parse(stored))

        if (validationResult.success) {
          setFormValues(validationResult.data || defaultValues)
        } else {
          localStorage.removeItem(STORAGE_KEY)
          setFormValues(defaultValues)
        }
      } else {
        setFormValues(defaultValues)
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY)
      setFormValues(defaultValues)
    }
  }, [])

  const updateValues = (values: Partial<OnboardingFormOptional>, isSubmit = false) => {
    let newValues = { ...formValues, ...values }

    // Clear conflicting fields when organization type changes
    if (values?.organizationType && values.organizationType !== formValues?.organizationType) {
      if (values.organizationType === "host") {
        // Clear sponsor fields
        delete newValues.industry
        delete newValues.employeeSize
      } else if (values.organizationType === "sponsor") {
        // Clear host fields
        delete newValues.hostOrganizationType
        delete newValues.eventsPerYear
      }
    }

    if (!isSubmit) {
      const validationResult = onboardingFormOptionalSchema.safeParse(newValues)
      if (!validationResult.success) {
        console.log("inValid values:", validationResult.error)
        return
      }
    }

    setFormValues(newValues)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newValues))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }

  const setCurrentStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      router.push(`/onboarding?step=${step}`)
    }
  }

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        formValues,
        updateValues,
        currentStep,
        setCurrentStep,
        goToNextStep,
        goToPreviousStep,
      }}
    >
      {formValues ? children : null}
    </OnboardingContext.Provider>
  )
}

export function useOnboardingForm() {
  const context = useContext(OnboardingContext)

  if (!context) {
    throw new Error("useOnboardingForm must be used within an OnboardingProvider")
  }

  return context
}
