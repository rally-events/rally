"use client"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { createSponsorRequestSchema } from "@rally/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { TextareaCounter } from "@/components/ui/textarea-counter"
import { api } from "@/lib/trpc/client"
import { toast } from "sonner"

interface EventViewSponsorModalProps {
  eventId: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function EventViewSponsorModal({
  eventId,
  isOpen,
  setIsOpen,
}: EventViewSponsorModalProps) {
  const form = useForm<z.infer<typeof createSponsorRequestSchema>>({
    resolver: zodResolver(createSponsorRequestSchema),
    defaultValues: {
      eventId,
      description: "",
      dollarAmount: undefined,
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const { mutate: createSponsorRequest, isPending: isCreatingSponsorRequest } =
    api.sponsorship.createSponsorRequest.useMutation()

  const onSubmit = async (data: z.infer<typeof createSponsorRequestSchema>) => {
    createSponsorRequest(data, {
      onSuccess: () => {
        setIsOpen(false)
        toast.success("Sponsor request created")
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Request to sponsor</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Request to sponsor</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <TextareaCounter {...field} maxLength={1000} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dollarAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isCreatingSponsorRequest}>
            Cancel
          </Button>
          <Button
            variant="default"
            isLoading={isCreatingSponsorRequest}
            onClick={form.handleSubmit(onSubmit)}
          >
            Request
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
