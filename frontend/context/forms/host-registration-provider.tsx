"use client"
import { fullHostSchema } from "@/lib/schemas/auth/host-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { createContext, useContext, ReactNode, useState } from "react"
import { useForm, UseFormReturn } from "react-hook-form"
import { z } from "zod"

const defaultValues: z.infer<typeof fullHostSchema> = {
  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  hostType: "",
  agreedToBeingInUnitedStates: false,
}

interface HostRegistrationContextType {
  form: UseFormReturn<z.infer<typeof fullHostSchema>>
  step: number
  setStep: (step: number) => void
}

const HostRegistrationContext = createContext<
  HostRegistrationContextType | undefined
>(undefined)

interface HostRegistrationProviderProps {
  children: ReactNode
}

export function HostRegistrationProvider({
  children,
}: HostRegistrationProviderProps) {
  const [step, setStep] = useState(1)
  const form = useForm<z.infer<typeof fullHostSchema>>({
    resolver: zodResolver(fullHostSchema),
    defaultValues,
  })

  return (
    <HostRegistrationContext.Provider value={{ form, step, setStep }}>
      {children}
    </HostRegistrationContext.Provider>
  )
}

export function useHostRegistration() {
  const context = useContext(HostRegistrationContext)
  if (context === undefined) {
    throw new Error(
      "useHostRegistration must be used within a HostRegistrationProvider"
    )
  }
  return context
}
