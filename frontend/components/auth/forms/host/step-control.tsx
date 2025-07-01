"use client"

import { useHostRegistration } from "@/context/forms/host-registration-provider"
import { ArrowLeftIcon } from "lucide-react"

import { User } from "lucide-react"
import Link from "next/link"

export default function StepControl() {
  const { step, setStep } = useHostRegistration()

  const handleSetStep = (step: number) => {
    setStep(step)
  }

  return (
    <nav className="flex flex-col gap-4 flex-shrink-0">
      <FormStep
        title="Organization setup"
        description="Get started with the basics"
        icon={<User />}
        onClick={() => handleSetStep(1)}
        active={step === 1}
      />
      <FormStep
        title="Typical attendees"
        description="Tell us about your typical demographics"
        icon={<User />}
        onClick={() => handleSetStep(2)}
        active={step === 2}
      />
      <FormStep
        title="Goals"
        description="What do you want out of Rally?"
        icon={<User />}
        onClick={() => handleSetStep(3)}
        active={step === 3}
      />
      <FormStep
        title="Account setup"
        description="Create a login and get started!"
        icon={<User />}
        onClick={() => handleSetStep(4)}
        active={step === 4}
        lastLine
      />
    </nav>
  )
}

interface FormStepProps {
  title: string
  description: string
  icon: React.ReactNode
  lastLine?: boolean
  active?: boolean
  onClick?: () => void
}

const FormStep = ({
  title,
  description,
  icon,
  lastLine,
  onClick,
  active,
}: FormStepProps) => {
  return (
    <div
      className="flex items-center gap-3 p-2 rounded-md group -mx-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <div
          className={`${active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"} p-2 rounded-md border bg-background transition-colors duration-75`}
        >
          {icon}
        </div>
        {!lastLine && (
          <div className="w-0.5 h-full bg-border absolute left-1/2 -translate-x-1/2" />
        )}
      </div>
      <div className="flex flex-col">
        <p
          className={`${active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"} font-medium leading-tight transition-colors duration-75`}
        >
          {title}
        </p>
        <p
          className={`${active ? "text-muted-foreground" : "text-muted-foreground/60 group-hover:text-muted-foreground"} text-sm transition-colors duration-75 leading-tight`}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
