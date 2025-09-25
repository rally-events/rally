"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { onboardingFormOptionalSchema, onboardingFormSchema } from "@rally/schemas"
import z from "zod"

export type OnboardingFormOptional = z.infer<typeof onboardingFormOptionalSchema>
export type OnboardingForm = z.infer<typeof onboardingFormSchema>

interface OnboardingContextType {
  formValues: OnboardingFormOptional
  updateValues: (values: Partial<OnboardingForm>, isSubmit?: boolean) => void
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
  const [formValues, setFormValues] = useState<OnboardingFormOptional>(undefined)

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
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY)
      setFormValues(defaultValues)
    }
  }, [])

  const updateValues = (values: Partial<OnboardingForm>, isSubmit = false) => {
    const newValues = { ...formValues, ...values }

    if (!isSubmit) {
      const validationResult = onboardingFormOptionalSchema.safeParse(newValues)
      if (!validationResult.success) {
        console.error("Invalid values:", validationResult.error)
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

  return (
    <OnboardingContext.Provider value={{ formValues, updateValues }}>
      {/* // TODO: make this match the loading ui */}
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
