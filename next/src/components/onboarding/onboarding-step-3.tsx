"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { onboardingStep3Schema } from "@rally/schemas"
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
import { useOnboardingForm } from "@/components/onboarding/onboarding-provider"
import { useAddressAutocomplete } from "@/hooks/use-address-autocomplete"
import z from "zod"
import { LoaderIcon } from "lucide-react"

export type OnboardingStep3 = z.infer<typeof onboardingStep3Schema>

export default function OnboardingStep3() {
  const { formValues, updateValues, goToPreviousStep, goToNextStep } = useOnboardingForm()

  const form = useForm<OnboardingStep3>({
    resolver: zodResolver(onboardingStep3Schema),
    defaultValues: {
      address: formValues?.address || "",
      city: formValues?.city || "",
      state: formValues?.state || "",
      zipCode: formValues?.zipCode || "",
      country: formValues?.country || "",
    },
  })

  const {
    query,
    predictions,
    isSearching,
    isLoadingDetails,
    showSuggestions,
    selectedPredictionId,
    handleInputChange,
    handlePredictionSelect,
    handleInputBlur,
    handleInputFocus,
    clearSuggestions,
  } = useAddressAutocomplete({
    onAddressSelect: (addressComponents) => {
      form.setValue("address", addressComponents.address)
      form.setValue("city", addressComponents.city)
      form.setValue("state", addressComponents.state)
      form.setValue("zipCode", addressComponents.zipCode)
      form.setValue("country", addressComponents.country)
    },
  })

  const onSubmit = (data: OnboardingStep3) => {
    updateValues(data, true)
    goToNextStep()
    // This could navigate to a completion page or submit the entire form
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Organization Address</h2>
        <p className="text-muted-foreground mt-2">Please provide your organization's address.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Start typing your address..."
                      value={query}
                      disabled={isLoadingDetails}
                      onChange={(e) => {
                        handleInputChange(e.target.value)
                        field.onChange(e.target.value)
                      }}
                      onFocus={handleInputFocus}
                      onBlur={(e) => {
                        handleInputBlur()
                        field.onBlur()
                        updateValues(form.getValues())
                      }}
                    />

                    {(isSearching || isLoadingDetails) && (
                      <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        <LoaderIcon className="text-muted-foreground h-4 w-4 animate-spin" />
                      </div>
                    )}

                    {showSuggestions && predictions.length > 0 && (
                      <div className="bg-popover absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border p-1 shadow-md">
                        {predictions.map((prediction) => {
                          const isSelected = selectedPredictionId === prediction.placeId
                          const isDisabled = isLoadingDetails && !isSelected

                          return (
                            <div
                              key={prediction.placeId}
                              className={`relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none ${
                                isDisabled
                                  ? "text-muted-foreground cursor-not-allowed opacity-50"
                                  : "hover:bg-accent hover:text-accent-foreground"
                              }`}
                              onClick={() => !isDisabled && handlePredictionSelect(prediction)}
                            >
                              <span className="flex-1">{prediction.description}</span>
                              {isSelected && <LoaderIcon className="ml-2 h-4 w-4 animate-spin" />}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City"
                      disabled={isLoadingDetails}
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
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="State"
                      disabled={isLoadingDetails}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Zip Code"
                      disabled={isLoadingDetails}
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Country"
                      disabled={isLoadingDetails}
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
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
              className="flex-1"
              disabled={isLoadingDetails}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!form.formState.isValid || isLoadingDetails}
            >
              Complete
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
