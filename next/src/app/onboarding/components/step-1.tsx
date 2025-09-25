"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { onboardingStep1Schema } from "@rally/schemas"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useOnboardingForm } from "@/components/onboarding/onboarding-provider"
import z from "zod"

export type OnboardingStep1 = z.infer<typeof onboardingStep1Schema>

export function Step1() {
  const { formValues, updateValues } = useOnboardingForm()

  const form = useForm<OnboardingStep1>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: {
      organizationType: formValues?.organizationType || "",
      organizationName: formValues?.organizationName || "",
    },
  })

  const onSubmit = (data: OnboardingStep1) => {
    updateValues(data, true)
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Create Your Organization</h2>
        <p className="text-muted-foreground mt-2">
          Let's start by setting up your organization profile.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="organizationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What type of organization are you?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateValues(form.getValues())
                    }}
                    value={field.value}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="host" id="host" />
                      <Label htmlFor="host" className="cursor-pointer">
                        Host Organization - We host events
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sponsor" id="sponsor" />
                      <Label htmlFor="sponsor" className="cursor-pointer">
                        Sponsor Organization - We sponsor events
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("organizationType") && (
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your organization name"
                      {...field}
                      onBlur={() => {
                        field.onBlur()
                        updateValues(form.getValues())
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch("organizationType") && form.watch("organizationName") && (
            <Button type="submit" className="w-full">
              Continue
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}
