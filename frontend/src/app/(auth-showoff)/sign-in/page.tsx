import LoginForm from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import React from "react"

export default function page() {
  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-medium leading-tight">
        Welcome back to Rally!
      </h1>
      <p className="text-muted-foreground leading-tight mb-4">
        Sign in with your credentials below
      </p>
      <LoginForm />
      <Separator className="my-4" />
      <Button variant="outline" size="lg" className="w-full mb-4">
        Sign in with Google
      </Button>
    </div>
  )
}
