"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { onboardingStep4Schema } from "@rally/schemas"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useOnboardingForm } from "@/components/onboarding/onboarding-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangleIcon } from "lucide-react"
import z from "zod"

export type OnboardingStep4 = z.infer<typeof onboardingStep4Schema>

export default function OnboardingStep4() {
  const {
    formValues,
    updateValues,
    goToPreviousStep,
    onSubmit,
    isSubmitting,
    formErrors,
    submitError,
    setCurrentStep,
  } = useOnboardingForm()

  const form = useForm<OnboardingStep4>({
    resolver: zodResolver(onboardingStep4Schema),
    defaultValues: {
      instagram: formValues?.instagram || "",
      tiktok: formValues?.tiktok || "",
      website: formValues?.website || "",
      contactEmail: formValues?.contactEmail || "",
      agreeToTerms: formValues?.agreeToTerms || false,
      isUsBasedOrganization: formValues?.isUsBasedOrganization || false,
    },
  })

  const handleFormSubmit = (data: OnboardingStep4) => {
    // Update values in context
    updateValues(data, true)

    // Call the context's onSubmit which validates and submits
    onSubmit()
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Social Media & Contact</h2>
        <p className="text-muted-foreground mt-2">
          Help us connect with your organization online and finalize your setup.
        </p>
      </div>

      {formErrors.length > 0 && (
        <div className="space-y-3">
          {formErrors.map((formError, index) => (
            <Alert key={index} variant="destructive">
              <AlertTriangleIcon className="size-4" />
              <AlertTitle>
                {formError.stepName} (Step {formError.step})
              </AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  {formError.errors.map((error, errorIndex) => (
                    <li key={errorIndex}>{error}</li>
                  ))}
                </ul>
                <Button
                  variant="link"
                  className="mt-2 h-auto p-0"
                  onClick={() => setCurrentStep(formError.step)}
                >
                  Go to {formError.stepName}
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {submitError && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="size-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram Handle (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="@yourorganization"
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

          <FormField
            control={form.control}
            name="tiktok"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TikTok Handle (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="@yourorganization"
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

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://yourorganization.com"
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

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contact@yourorganization.com"
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

          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                      updateValues({ ...form.getValues(), agreeToTerms: !!checked })
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="hover:text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="hover:text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isUsBasedOrganization"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                      updateValues({ ...form.getValues(), isUsBasedOrganization: !!checked })
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    I confirm that my organization is based in the United States
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
              className="flex-1"
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!form.formState.isValid || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
