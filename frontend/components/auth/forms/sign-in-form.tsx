"use client"
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { signInSchema } from "@/lib/schemas/auth/form-schemas"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import Link from "next/link"

export default function SignInForm() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel hidden>Email</FormLabel>
              <FormControl>
                <Input type="email" size="xl" placeholder="Email" {...field} />
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
              <FormControl>
                <PasswordInput
                  type="password"
                  size="xl"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <span className="flex items-center justify-end">
                <FormLabel hidden>Password</FormLabel>
                <Link
                  href={"/accounts/sign-in"}
                  className={`${buttonVariants({ variant: "link" })} !p-0 !m-0`}
                >
                  Forgot password?
                </Link>
              </span>
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <Button type="submit" className="w-full mt-4">
            Sign In
          </Button>
        </div>
      </form>
    </Form>
  )
}
