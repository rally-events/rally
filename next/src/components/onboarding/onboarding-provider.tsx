"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { onboardingFormOptionalSchema, onboardingFormSchema } from "@rally/schemas"
import { trpc } from "@/lib/trpc/provider"
import z from "zod"

export type OnboardingFormOptional = z.infer<typeof onboardingFormOptionalSchema>
export type OnboardingForm = z.infer<typeof onboardingFormSchema>

interface FormError {
  step: number
  stepName: string
  errors: string[]
}

interface OnboardingContextType {
  formValues: OnboardingFormOptional
  updateValues: (values: Partial<OnboardingFormOptional>, isSubmit?: boolean) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  onSubmit: () => void
  isSubmitting: boolean
  formErrors: FormError[]
  submitError: string | null
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
  const [formErrors, setFormErrors] = useState<FormError[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { mutate: createOrganization, isPending: isSubmitting } =
    trpc.organization.createOrganization.useMutation({
      onMutate: () => {
        setSubmitError(null)
        setFormErrors([])
      },
      onSuccess: () => {
        // Clear localStorage onboarding data
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch (error) {
          console.error("Failed to clear localStorage:", error)
        }
        // Redirect to dashboard or organization page
        router.push("/dashboard/overview")
      },
      onError: (error) => {
        setSubmitError(error.message || "Failed to create organization. Please try again.")
      },
    })

  useEffect(() => {
    const stepParam = searchParams.get("step")
    const stepNumber = stepParam ? parseInt(stepParam, 10) : 1

    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 4) {
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
    if (step >= 1 && step <= 4) {
      router.push(`/onboarding?step=${step}`)
    }
  }

  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepName = (step: number): string => {
    switch (step) {
      case 1:
        return "Organization Information"
      case 2:
        return "Organization Details"
      case 3:
        return "Address Information"
      case 4:
        return "Contact & Terms"
      default:
        return `Step ${step}`
    }
  }

  const validateFormData = (): { isValid: boolean; errors: FormError[] } => {
    const errors: FormError[] = []

    // Validate complete form
    const validationResult = onboardingFormSchema.safeParse(formValues)

    if (!validationResult.success) {
      const zodErrors = validationResult.error.issues

      // Group errors by which step they belong to
      const step1Fields = ["organizationType", "organizationName"]
      const step2HostFields = ["hostOrganizationType", "eventsPerYear"]
      const step2SponsorFields = ["industry", "employeeSize"]
      const step3Fields = ["address", "city", "state", "zipCode", "country"]
      const step4Fields = ["instagram", "tiktok", "website", "contactEmail", "agreeToTerms", "isUsBasedOrganization"]

      const step1Errors: string[] = []
      const step2Errors: string[] = []
      const step3Errors: string[] = []
      const step4Errors: string[] = []

      zodErrors.forEach((error: z.ZodIssue) => {
        const fieldPath = error.path.join(".")

        if (step1Fields.includes(fieldPath)) {
          step1Errors.push(error.message)
        } else if (step2HostFields.includes(fieldPath) || step2SponsorFields.includes(fieldPath)) {
          step2Errors.push(error.message)
        } else if (step3Fields.includes(fieldPath)) {
          step3Errors.push(error.message)
        } else if (step4Fields.includes(fieldPath)) {
          step4Errors.push(error.message)
        } else {
          // Default to current step if we can't determine
          step4Errors.push(error.message)
        }
      })

      if (step1Errors.length > 0) {
        errors.push({ step: 1, stepName: getStepName(1), errors: step1Errors })
      }
      if (step2Errors.length > 0) {
        errors.push({ step: 2, stepName: getStepName(2), errors: step2Errors })
      }
      if (step3Errors.length > 0) {
        errors.push({ step: 3, stepName: getStepName(3), errors: step3Errors })
      }
      if (step4Errors.length > 0) {
        errors.push({ step: 4, stepName: getStepName(4), errors: step4Errors })
      }
    }

    return { isValid: validationResult.success, errors }
  }

  const onSubmit = () => {
    setSubmitError(null)
    setFormErrors([])

    const { isValid, errors } = validateFormData()

    if (!isValid) {
      setFormErrors(errors)
      return
    }

    // Type assertion is safe here because we validated with onboardingFormSchema
    createOrganization(formValues as OnboardingForm)
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
        onSubmit,
        isSubmitting,
        formErrors,
        submitError,
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
