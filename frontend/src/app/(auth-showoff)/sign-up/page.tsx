import SignupForm from "@/components/auth/sign-up-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import React from "react"

export default function page() {
  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-medium leading-tight">Welcome to Rally!</h1>
      <p className="text-muted-foreground leading-tight mb-4">
        Sign up with your credentials below
      </p>
      <SignupForm />
      <Separator className="my-4" />
      <Button variant="outline" size="lg" className="w-full mb-4">
        Sign up with Google
      </Button>
    </div>
  )
}
