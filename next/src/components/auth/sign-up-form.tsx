"use client"

import { signUpSchema } from "@rally/schemas"
import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { trpc } from "@/lib/trpc/provider"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertTriangleIcon } from "lucide-react"

type SignupForm = z.infer<typeof signUpSchema>

export default function SignupForm() {
  const router = useRouter()
  const form = useForm<SignupForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  })
  const { error, mutate, isPending } = trpc.user.registerUser.useMutation({
    onSuccess: () => {
      router.push("/onboarding?step=1")
    },
    onError: async (error) => {
      console.error("error", error.message)
    },
  })

  return (
    <>
      <Separator className="my-4" />
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangleIcon className="size-4" />
          <AlertDescription>
            {error.message === "User already registered"
              ? "That email already has a Rally account registered to it."
              : "We couldn't sign you up, please try again later."}
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form className="flex flex-col gap-5" onSubmit={form.handleSubmit((data) => mutate(data))}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input size="lg" placeholder="john@rally.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input size="lg" placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input size="lg" placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput size="lg" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button isLoading={isPending} type="submit" size="lg" className="mt-2 w-full">
            Get started
          </Button>
        </form>
      </Form>
    </>
  )
}
