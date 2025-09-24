import React from "react"
import { useOnboarding } from "./onboarding-provider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { onboardingStep1Schema } from "@/schemas/auth/onboarding-schemas"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

export default function OnboardingStep1() {
  const { formValues, setFormValues, handleStepChange } = useOnboarding()
  const form = useForm<z.infer<typeof onboardingStep1Schema>>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: {
      companyCategory: formValues.companyCategory,
      hostOrSponsor: formValues.hostOrSponsor,
    },
  })

  const onSubmit = (data: z.infer<typeof onboardingStep1Schema>) => {
    setFormValues((prev) => ({ ...prev, ...data }))
    handleStepChange(2)
  }

  const hostOrSponsor = form.watch("hostOrSponsor")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="hostOrSponsor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What do you want from Rally?</FormLabel>

              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-2"
                >
                  <FormItem className="group">
                    <FormControl className="sr-only">
                      <RadioGroupItem value="host" />
                    </FormControl>
                    <FormLabel className="group-has-[input:checked]:bg-primary/10 group-has-[input:checked]:border-primary rounded-md border p-2">
                      Host
                    </FormLabel>
                  </FormItem>
                  <FormItem className="group">
                    <FormControl className="sr-only">
                      <RadioGroupItem value="sponsor" />
                    </FormControl>
                    <FormLabel className="group-has-[input:checked]:bg-primary/10 group-has-[input:checked]:border-primary rounded-md border p-2">
                      Sponsor
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {hostOrSponsor !== "" && (
          <>
            <FormField
              control={form.control}
              name="companyCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {hostOrSponsor === "host" ? "Organization type" : "Industry"}
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="real estate">Real Estate</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Next</Button>
            </div>
          </>
        )}
      </form>
    </Form>
  )
}
