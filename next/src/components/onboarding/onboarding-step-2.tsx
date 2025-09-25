"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  onboardingStep2HostSchema,
  onboardingStep2SponsorSchema,
  hostOrganizationTypes,
  sponsorIndustries,
  employeeSizeRanges,
} from "@rally/schemas"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useOnboardingForm } from "@/components/onboarding/onboarding-provider"
import z from "zod"

type HostStep2Data = z.infer<typeof onboardingStep2HostSchema>
type SponsorStep2Data = z.infer<typeof onboardingStep2SponsorSchema>

export default function OnboardingStep2() {
  const { formValues, updateValues, goToNextStep, goToPreviousStep } = useOnboardingForm()

  const organizationType = formValues?.organizationType

  const hostForm = useForm<HostStep2Data>({
    resolver: zodResolver(onboardingStep2HostSchema),
    defaultValues: {
      hostOrganizationType: formValues?.hostOrganizationType || "",
      eventsPerYear: formValues?.eventsPerYear || 0,
    },
  })

  const sponsorForm = useForm<SponsorStep2Data>({
    resolver: zodResolver(onboardingStep2SponsorSchema),
    defaultValues: {
      industry: formValues?.industry || "",
      employeeSize: formValues?.employeeSize || "",
    },
  })

  const onHostSubmit = (data: HostStep2Data) => {
    updateValues(data, true)
    goToNextStep()
  }

  const onSponsorSubmit = (data: SponsorStep2Data) => {
    updateValues(data, true)
    goToNextStep()
  }

  if (!organizationType) {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Complete Previous Step</h2>
          <p className="text-muted-foreground mt-2">Please complete Step 1 first to continue.</p>
        </div>
        <Button onClick={goToPreviousStep} variant="outline" className="w-full">
          Go Back to Step 1
        </Button>
      </div>
    )
  }

  if (organizationType === "host") {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Tell Us More About Your Organization</h2>
          <p className="text-muted-foreground mt-2">
            Help us understand your hosting organization better.
          </p>
        </div>

        <Form {...hostForm}>
          <form onSubmit={hostForm.handleSubmit(onHostSubmit)} className="space-y-6">
            <FormField
              control={hostForm.control}
              name="hostOrganizationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What type of organization are you?</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateValues(hostForm.getValues())
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hostOrganizationTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={hostForm.control}
              name="eventsPerYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How many events do you host per year on average?</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="e.g., 12"
                      onChange={(e) => {
                        field.onChange(e.target.value)
                      }}
                      onBlur={() => {
                        updateValues({ eventsPerYear: field.value })
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={goToPreviousStep} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    )
  }

  if (organizationType === "sponsor") {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Tell Us About Your Company</h2>
          <p className="text-muted-foreground mt-2">
            Help us understand your sponsoring organization better.
          </p>
        </div>

        <Form {...sponsorForm}>
          <form onSubmit={sponsorForm.handleSubmit(onSponsorSubmit)} className="space-y-6">
            <FormField
              control={sponsorForm.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What industry is your organization in?</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateValues(sponsorForm.getValues())
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sponsorIndustries.map((industry) => (
                        <SelectItem key={industry.id} value={industry.id}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={sponsorForm.control}
              name="employeeSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How many employees does your organization have?</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateValues(sponsorForm.getValues())
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee count" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employeeSizeRanges.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={goToPreviousStep} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    )
  }

  return null
}
