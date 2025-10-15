import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { trpc } from "@/lib/trpc/provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserInfo } from "@rally/api"
import { addPhoneAuthSchema, verifyPhoneAuthSchema } from "@rally/schemas"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

interface AddPhoneModalProps {
  user: UserInfo
}

export default function AddPhoneModal({ user }: AddPhoneModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<"add-phone" | "verify-phone">(
    user.supabaseMetadata.phone_number ? "verify-phone" : "add-phone",
  )

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Add Phone Number</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Phone Number</AlertDialogTitle>
          <AlertDialogDescription>Add your phone number to continue.</AlertDialogDescription>
        </AlertDialogHeader>
        {step === "add-phone" ? (
          <AddPhoneNumberForm setIsOpen={setIsOpen} setStep={setStep} />
        ) : (
          <VerifyPhoneNumberForm setIsOpen={setIsOpen} />
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface AddPhoneNumberFormProps {
  setIsOpen: (isOpen: boolean) => void
  setStep: (step: "add-phone" | "verify-phone") => void
}

const AddPhoneNumberForm = ({ setIsOpen }: AddPhoneNumberFormProps) => {
  const form = useForm<z.infer<typeof addPhoneAuthSchema>>({
    resolver: zodResolver(addPhoneAuthSchema),
    defaultValues: {
      phoneNumber: "",
    },
  })

  const { error, mutate, isPending } = trpc.auth.addPhoneAuth.useMutation({
    onSuccess: () => {
      toast.success("Phone number added successfully")
    },
    onError: async (error) => {
      console.error("error", error.message)
      toast.error(error.message)
    },
  })

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutate(data))}>
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input size="lg" placeholder="123-456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <AlertDialogFooter>
        <Button variant="ghost" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button onClick={form.handleSubmit((data) => mutate(data))}>Add Phone Number</Button>
      </AlertDialogFooter>
    </>
  )
}

interface VerifyPhoneNumberFormProps {
  setIsOpen: (isOpen: boolean) => void
}

const VerifyPhoneNumberForm = ({ setIsOpen }: VerifyPhoneNumberFormProps) => {
  const form = useForm<z.infer<typeof verifyPhoneAuthSchema>>({
    resolver: zodResolver(verifyPhoneAuthSchema),
    defaultValues: {
      code: "",
    },
  })

  const { error, mutate, isPending } = trpc.auth.verifyPhoneAuth.useMutation({
    onSuccess: () => {
      toast.success("Phone number verified successfully")
    },
    onError: async (error) => {
      console.error("error", error.message)
      toast.error(error.message)
    },
  })

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutate(data))}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input size="lg" placeholder="123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <AlertDialogFooter>
        <Button variant="ghost" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button onClick={form.handleSubmit((data) => mutate(data))}>Verify Phone Number</Button>
      </AlertDialogFooter>
    </>
  )
}
