"use client"

import { loginSchema } from "@/schemas/auth/login-schemas"
import React, { useState } from "react"
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
import { Separator } from "../ui/separator"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import sendVerificationEmail from "@/mutations/email/sendVerificationEmail"

type LoginForm = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginForm) => {
    const client = createClient()
    const { data: userData, error } = await client.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setError(error.message)
      return
    }
    if (!userData.user?.user_metadata.is_email_verified) {
      await sendVerificationEmail(data.email)
      router.push("/verify")
      return
    }
    router.push("/dashboard/overview")
  }

  return (
    <>
      <Separator className="my-4" />
      {error && <p className="text-red-500">{error}</p>}
      <Form {...form}>
        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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
          <Button type="submit" size="lg" className="w-full mt-2">
            Login
          </Button>
        </form>
      </Form>
    </>
  )
}
