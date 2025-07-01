"use client"
import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { waitlistSchema } from "@/lib/schemas/waitlist-schema"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
export default function WaitlistForm() {
  const form = useForm<z.infer<typeof waitlistSchema>>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
      name: "",
      organization: "",
    },
  })

  const onSubmit = (values: z.infer<typeof waitlistSchema>) => {
    console.log(values)
  }

  const isHost = form.watch("isHost")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="isHost"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={isHost ? "default" : "outline"}
                  onClick={() => field.onChange(true)}
                >
                  Host
                </Button>
                <Button
                  variant={isHost ? "outline" : "default"}
                  onClick={() => field.onChange(false)}
                >
                  Sponsor
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Join the waitlist</Button>
      </form>
    </Form>
  )
}
