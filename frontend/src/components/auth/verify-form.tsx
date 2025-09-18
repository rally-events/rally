"use client"
import { verifySchema } from "@/schemas/auth/login-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"
import { Button, buttonVariants } from "../ui/button"
import { ArrowRightIcon, ClipboardIcon } from "lucide-react"
import { Separator } from "../ui/separator"
import verifyEmailWithCode from "@/mutations/user/verifyEmailWithCode"
import { createClient } from "@/utils/supabase/client"
import sendVerificationEmail from "@/mutations/email/sendVerificationEmail"
import { useRouter } from "next/navigation"
import Link from "next/link"

type VerifyForm = z.infer<typeof verifySchema>

export default function VerifyForm({ code }: { code?: string }) {
  const [error, setError] = useState<string | null>(null)
  const [didVerify, setDidVerify] = useState(false)
  const router = useRouter()
  const form = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: code || "",
    },
  })

  const onSubmit = async (data: VerifyForm) => {
    const { error } = await verifyEmailWithCode(data.code)
    if (error) {
      setError("Invalid code")
    } else {
      setDidVerify(true)
    }
  }

  const handleOTPChange = (value: string) => {
    form.setValue("code", value, { shouldValidate: true, shouldDirty: true })

    if (value.length === 6) {
      form.trigger("code").then((isValid) => {
        if (isValid) {
          form.handleSubmit(onSubmit)()
        }
      })
    }
  }

  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        setError("Could not paste from clipboard")
      }

      const clipboardText = await navigator.clipboard.readText()

      const isValid6DigitCode = /^[0-9]{6}$/.test(clipboardText.trim())

      if (isValid6DigitCode) {
        form.setValue("code", clipboardText.trim())
      } else {
        setError("Invalid code from clipboard")
      }
    } catch (error) {
      setError("Could not paste from clipboard")
    }
  }

  const handleResendCode = async () => {
    const client = await createClient()
    const { data, error } = await client.auth.getUser()
    if (!data.user?.email || error) {
      setError("Not logged in")
      return
    }
    const { error: sendError } = await sendVerificationEmail(data.user.email)
    if (sendError) {
      setError("Could not resend code")
      return
    }
  }

  if (!didVerify) {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-4xl leading-tight font-medium">Email verified!</h1>
        <p className="text-muted-foreground mb-8 max-w-sm text-center leading-tight">
          Your email has been verified and you can now continue to Rally
        </p>
        <Button onClick={() => router.push("/dashboard/overview")}>
          Go to dashboard <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-4xl leading-tight font-medium">Welcome to Rally!</h1>
      <p className="text-muted-foreground mb-8 max-w-sm text-center leading-tight">
        Use the code sent to your email to verify your account and continue to Rally
      </p>
      {error && <p className="text-red-500">{error}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-fit flex-col gap-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormControl>
                  <InputOTP
                    disabled={form.formState.isSubmitting}
                    variant="gaps"
                    maxLength={6}
                    {...field}
                    onChange={handleOTPChange}
                  >
                    <InputOTPGroup>
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
                <Separator />
                <Button
                  disabled={form.formState.isSubmitting}
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handlePasteFromClipboard}
                >
                  Paste from clipboard <ClipboardIcon />
                </Button>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={form.formState.isSubmitting}
              type="button"
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={handleResendCode}
            >
              Resend code
            </Button>
            <Link
              className={buttonVariants({ variant: "ghost", size: "lg" })}
              href="/dashboard/overview"
            >
              Verify later
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </form>
      </Form>
    </>
  )
}
