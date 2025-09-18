import LoginForm from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import React from "react"

export default function page() {
  return (
    <div className="flex flex-col">
      <h1 className="text-4xl leading-tight font-medium">Welcome back to Rally!</h1>
      <p className="text-muted-foreground mb-4 leading-tight">
        Sign in with your credentials below
      </p>
      <LoginForm />
      <Separator className="my-4" />
      <Button variant="outline" size="lg" className="mb-4 w-full">
        Sign in with Google
      </Button>
    </div>
  )
}
