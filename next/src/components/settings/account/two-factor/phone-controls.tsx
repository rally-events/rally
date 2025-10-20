"use client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { PhoneInput } from "@/components/ui/phone-input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { trpc } from "@/lib/trpc/provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserInfo } from "@rally/api"
import { addPhoneAuthSchema, verifyPhoneAuthSchema } from "@rally/schemas"
import { AlertTriangleIcon } from "lucide-react"
import React, { SetStateAction, Dispatch, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

interface PhoneControlsProps {
  userInfo: UserInfo<{ withChallenges: true }>
  setUserInfo: Dispatch<SetStateAction<UserInfo<{ withChallenges: true }>>>
}

export default function PhoneControls({ userInfo, setUserInfo }: PhoneControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [hasPhoneNumber, setHasPhoneNumber] = useState(
    userInfo.phoneChallenge && userInfo.phoneChallenge.expiresAt > new Date() ? true : false,
  )

  const { mutate, isPending } = trpc.auth.removePhoneAuth.useMutation({
    onSuccess: () => {
      toast.success("Phone number deleted successfully")
      setHasPhoneNumber(false)
      setIsConfirmOpen(false)
      setUserInfo({
        ...userInfo,
        supabaseMetadata: {
          ...userInfo.supabaseMetadata,
          is_phone_verified: false,
          phone_number: undefined,
        },
        phoneChallenge: null,
      })
    },
    onError: async (error) => {
      console.error("error", error.message)
      toast.error(error.message)
    },
  })

  if (!userInfo.supabaseMetadata.is_email_verified) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              Add Phone Number
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>You must verify your email address before you can add a phone number.</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {userInfo.supabaseMetadata.is_phone_verified ? (
        <Popover open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <PopoverTrigger asChild>
            <Button variant="destructive">Remove Phone Number</Button>
          </PopoverTrigger>
          <PopoverContent className="w-84">
            <div className="flex flex-col gap-4">
              <span className="flex items-center gap-3">
                <AlertTriangleIcon className="text-destructive size-6 flex-shrink-0" />
                <p className="text-destructive leading-tight">
                  Are you sure you want to remove your phone number?
                </p>
              </span>
              <Button variant="destructive" onClick={() => mutate()} isLoading={isPending}>
                Remove Phone Number
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">Add Phone Number</Button>
          </PopoverTrigger>
          <PopoverContent className="w-84">
            <AddPhoneNumberForm
              defaultPhoneNumber={userInfo.supabaseMetadata.phone_number}
              setHasPhoneNumber={setHasPhoneNumber}
              hasPhoneNumber={hasPhoneNumber}
              setUserInfo={setUserInfo}
              userInfo={userInfo}
            />
            <Separator className="my-4" />

            <VerifyPhoneNumberForm
              setIsOpen={setIsOpen}
              hasPhoneNumber={hasPhoneNumber}
              setHasPhoneNumber={setHasPhoneNumber}
              setUserInfo={setUserInfo}
              userInfo={userInfo}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

const AddPhoneNumberForm = ({
  setHasPhoneNumber,
  hasPhoneNumber,
  defaultPhoneNumber,
  setUserInfo,
  userInfo,
}: {
  setHasPhoneNumber: (hasPhoneNumber: boolean) => void
  hasPhoneNumber: boolean
  defaultPhoneNumber: string | undefined
  setUserInfo: Dispatch<SetStateAction<UserInfo<{ withChallenges: true }>>>
  userInfo: UserInfo<{ withChallenges: true }>
}) => {
  const form = useForm<z.infer<typeof addPhoneAuthSchema>>({
    resolver: zodResolver(addPhoneAuthSchema),
    defaultValues: {
      phoneNumber: defaultPhoneNumber || "",
    },
  })

  const { mutate, isPending } = trpc.auth.addPhoneAuth.useMutation({
    onSuccess: () => {
      setHasPhoneNumber(true)
      setUserInfo({
        ...userInfo,
        supabaseMetadata: {
          ...userInfo.supabaseMetadata,
          phone_number: form.getValues("phoneNumber"),
        },
        phoneChallenge: {
          id: "",
          userId: userInfo.id,
          factorId: "",
          challengeId: "",
          expiresAt: new Date(),
        },
      })
    },
    onError: async (error) => {
      console.error("error", error.message)
      toast.error(error.message)
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className={`space-y-4 ${hasPhoneNumber ? "pointer-events-none opacity-30" : ""} transition-opacity duration-200`}
      >
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-2">Enter your phone number</FormLabel>
              <FormControl>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  defaultCountry="US"
                  size="lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col">
          <Button size="sm" type="submit" isLoading={isPending}>
            Add Phone Number
          </Button>
        </div>
      </form>
    </Form>
  )
}

const VerifyPhoneNumberForm = ({
  setIsOpen,
  hasPhoneNumber,
  setHasPhoneNumber,
  setUserInfo,
  userInfo,
}: {
  setIsOpen: (isOpen: boolean) => void
  hasPhoneNumber: boolean
  setHasPhoneNumber: (hasPhoneNumber: boolean) => void
  setUserInfo: Dispatch<SetStateAction<UserInfo<{ withChallenges: true }>>>
  userInfo: UserInfo<{ withChallenges: true }>
}) => {
  const form = useForm<z.infer<typeof verifyPhoneAuthSchema>>({
    resolver: zodResolver(verifyPhoneAuthSchema),
    defaultValues: {
      code: "",
    },
  })
  const { mutate, isPending } = trpc.auth.verifyPhoneAuth.useMutation({
    onSuccess: () => {
      toast.success("Phone number verified successfully")
      setIsOpen(false)
      setUserInfo({
        ...userInfo,
        supabaseMetadata: {
          ...userInfo.supabaseMetadata,
          is_phone_verified: true,
        },
        phoneChallenge: null,
      })
    },
    onError: async (error) => {
      console.error("error", error.message)
      toast.error(error.message)
      form.reset({ code: "" })
    },
  })

  const handleOTPChange = (value: string) => {
    form.setValue("code", value, { shouldValidate: true, shouldDirty: true })

    if (value.length === 6) {
      form.trigger("code").then((isValid) => {
        if (isValid) {
          form.handleSubmit((data) => mutate(data))()
        }
      })
    }
  }

  const handleResetNumber = () => {
    form.reset({ code: "" })
    setHasPhoneNumber(false)
  }

  const handleResendCode = () => {}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className={`space-y-4 ${hasPhoneNumber ? "" : "pointer-events-none opacity-30"} transition-opacity duration-200`}
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Enter the code we texted you</FormLabel>
              <FormControl>
                <InputOTP
                  disabled={isPending || !hasPhoneNumber}
                  maxLength={6}
                  {...field}
                  onChange={handleOTPChange}
                >
                  <InputOTPGroup className="mx-auto">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              type="button"
              className="flex-grow"
              variant="outline"
              onClick={handleResetNumber}
              disabled={isPending}
            >
              Change phone number
            </Button>
            <Button
              size="sm"
              type="button"
              className="flex-grow"
              variant="outline"
              onClick={handleResetNumber}
              disabled={isPending}
            >
              Resend code
            </Button>
          </div>
          <Button size="sm" type="submit" isLoading={isPending}>
            Verify Phone Number
          </Button>
        </div>
      </form>
    </Form>
  )
}
