"use client"

import { useHostRegistration } from "@/context/forms/host-registration-provider"
import AccountSetup from "./steps/account-setup"
import OrganizationSetup from "./steps/organization-setup"
import TypicalAttendees from "./steps/typical-attendees"
import Goals from "./steps/goals"
import { Form } from "@/components/ui/form"

export default function StepRender() {
  const { step, form } = useHostRegistration()
  let stepComponent = null
  switch (step) {
    case 1:
      stepComponent = <OrganizationSetup />
      break
    case 2:
      stepComponent = <TypicalAttendees />
      break
    case 3:
      stepComponent = <Goals />
      break
    case 4:
      stepComponent = <AccountSetup />
      break
    default:
      return <p>Something went wrong</p>
  }
  return (
    <Form {...form}>
      <form className="flex-grow">{stepComponent}</form>
    </Form>
  )
}
