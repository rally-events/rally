import SignupForm from "@/components/auth/sign-up-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import React from "react"

export default function page() {
  return (
    <div className="flex flex-col">
      <h1 className="text-4xl leading-tight font-medium">Welcome to Rally!</h1>
      <p className="text-muted-foreground mb-4 leading-tight">
        Sign up with your credentials below
      </p>
      <SignupForm />
      <Separator className="my-4" />
      <Button variant="outline" size="lg" className="mb-4 w-full">
        Sign up with Google
      </Button>
    </div>
  )
}
