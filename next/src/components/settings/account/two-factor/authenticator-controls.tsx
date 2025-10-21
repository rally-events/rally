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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { trpc } from "@/lib/trpc/provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserInfo } from "@rally/api"
import { addAuthenticatorAuthSchema, verifyAuthenticatorAuthSchema } from "@rally/schemas"
import { AlertTriangleIcon, CopyIcon, CheckIcon } from "lucide-react"
import React, { SetStateAction, Dispatch, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

interface AuthenticatorControlsProps {
  userInfo: UserInfo<{ withChallenges: true }>
  setUserInfo: Dispatch<SetStateAction<UserInfo<{ withChallenges: true }>>>
}

export default function AuthenticatorControls({
  userInfo,
  setUserInfo,
}: AuthenticatorControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  // Check if there's a valid existing challenge
  const existingChallenge =
    userInfo.authenticatorChallenge && userInfo.authenticatorChallenge.expiresAt > new Date()

  const [qrCode, setQrCode] = useState<string | null>(
    existingChallenge ? (userInfo.authenticatorChallenge?.qrCode ?? null) : null,
  )
  const [hasAuthenticator, setHasAuthenticator] = useState(existingChallenge ? true : false)

  // Update state when userInfo changes (e.g., after refetch)
  useEffect(() => {
    const validChallenge =
      userInfo.authenticatorChallenge && userInfo.authenticatorChallenge.expiresAt > new Date()

    if (validChallenge) {
      setQrCode(userInfo.authenticatorChallenge?.qrCode ?? null)
      setHasAuthenticator(true)
    } else {
      setQrCode(null)
      setHasAuthenticator(false)
    }
  }, [userInfo.authenticatorChallenge])

  const { mutate, isPending } = trpc.auth.removeAuthenticatorAuth.useMutation({
    onSuccess: () => {
      toast.success("Authenticator app deleted successfully")
      setHasAuthenticator(false)
      setIsConfirmOpen(false)
      setUserInfo({
        ...userInfo,
        supabaseMetadata: {
          ...userInfo.supabaseMetadata,
          is_authenticator_verified: false,
        },
        authenticatorChallenge: null,
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
              Add Authenticator App
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>You must verify your email address before you can add an authenticator app.</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {userInfo.supabaseMetadata.is_authenticator_verified ? (
        <Popover open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <PopoverTrigger asChild>
            <Button variant="destructive">Remove Authenticator App</Button>
          </PopoverTrigger>
          <PopoverContent className="w-84">
            <div className="flex flex-col gap-4">
              <span className="flex items-center gap-3">
                <AlertTriangleIcon className="text-destructive size-6 flex-shrink-0" />
                <p className="text-destructive leading-tight">
                  Are you sure you want to remove your authenticator app?
                </p>
              </span>
              <Button variant="destructive" onClick={() => mutate()} isLoading={isPending}>
                Remove Authenticator App
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">Add Authenticator App</Button>
          </PopoverTrigger>
          <PopoverContent className="w-84">
            <AddAuthenticatorForm
              setHasAuthenticator={setHasAuthenticator}
              hasAuthenticator={hasAuthenticator}
              setUserInfo={setUserInfo}
              userInfo={userInfo}
              qrCode={qrCode}
              setQrCode={setQrCode}
            />
            <Separator className="my-4" />

            <VerifyAuthenticatorForm
              setIsOpen={setIsOpen}
              hasAuthenticator={hasAuthenticator}
              setHasAuthenticator={setHasAuthenticator}
              setUserInfo={setUserInfo}
              userInfo={userInfo}
              setQrCode={setQrCode}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

const AddAuthenticatorForm = ({
  setHasAuthenticator,
  hasAuthenticator,
  setUserInfo,
  userInfo,
  qrCode,
  setQrCode,
}: {
  setHasAuthenticator: (hasAuthenticator: boolean) => void
  hasAuthenticator: boolean
  setUserInfo: Dispatch<SetStateAction<UserInfo<{ withChallenges: true }>>>
  userInfo: UserInfo<{ withChallenges: true }>
  qrCode: string | null
  setQrCode: (qrCode: string) => void
}) => {
  // Initialize secret from existing challenge if available
  const existingSecret =
    userInfo.authenticatorChallenge && userInfo.authenticatorChallenge.expiresAt > new Date()
      ? userInfo.authenticatorChallenge.secret
      : null

  const [secret, setSecret] = useState<string | null>(existingSecret)
  const [copiedSecret, setCopiedSecret] = useState(false)

  // Update secret when userInfo changes
  useEffect(() => {
    const validChallenge =
      userInfo.authenticatorChallenge && userInfo.authenticatorChallenge.expiresAt > new Date()

    if (validChallenge) {
      setSecret(userInfo.authenticatorChallenge?.secret ?? null)
    } else {
      setSecret(null)
    }
  }, [userInfo.authenticatorChallenge])

  const form = useForm<z.infer<typeof addAuthenticatorAuthSchema>>({
    resolver: zodResolver(addAuthenticatorAuthSchema),
    defaultValues: {
      friendlyName: "Authenticator App",
    },
  })

  const { mutate, isPending } = trpc.auth.addAuthenticatorAuth.useMutation({
    onSuccess: (data) => {
      setHasAuthenticator(true)
      setQrCode(data.qrCode)
      setSecret(data.secret)
      setUserInfo({
        ...userInfo,
        authenticatorChallenge: {
          id: "",
          userId: userInfo.id,
          factorId: "",
          qrCode: data.qrCode,
          secret: data.secret,
          uri: data.uri,
          expiresAt: new Date(Date.now() + 1000 * 60 * 10),
        },
      })
    },
    onError: async (error) => {
      console.error("error", error.message)
      toast.error(error.message)
    },
  })

  const handleCopySecret = async () => {
    if (secret) {
      await navigator.clipboard.writeText(secret)
      setCopiedSecret(true)
      toast.info("Secret copied to clipboard")
      setTimeout(() => setCopiedSecret(false), 2000)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutate(data))} className={`space-y-4`}>
        <div className="flex flex-col gap-2">
          {!qrCode ? (
            <>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Setup Authenticator App</p>
                <p className="text-muted-foreground text-sm">
                  Click the button below to generate a QR code to scan with your authenticator app.
                </p>
              </div>
              <Button size="sm" type="submit" isLoading={isPending}>
                Generate QR Code
              </Button>
            </>
          ) : (
            <>
              <img src={qrCode} alt="QR Code" className="mx-auto h-52 w-52" />
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-sm">
                  If you can't scan the QR code, enter this secret key manually:
                </p>
                <div className="flex items-center gap-2">
                  <code className="bg-muted flex-1 rounded p-2 font-mono text-xs break-all">
                    {secret}
                  </code>
                  <Button size="sm" variant="outline" type="button" onClick={handleCopySecret}>
                    {copiedSecret ? (
                      <CheckIcon className="size-4" />
                    ) : (
                      <CopyIcon className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}

const VerifyAuthenticatorForm = ({
  setIsOpen,
  hasAuthenticator,
  setHasAuthenticator,
  setUserInfo,
  userInfo,
  setQrCode,
}: {
  setIsOpen: (isOpen: boolean) => void
  hasAuthenticator: boolean
  setHasAuthenticator: (hasAuthenticator: boolean) => void
  setUserInfo: Dispatch<SetStateAction<UserInfo<{ withChallenges: true }>>>
  userInfo: UserInfo<{ withChallenges: true }>
  setQrCode: (qrCode: null | string) => void
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof verifyAuthenticatorAuthSchema>>({
    resolver: zodResolver(verifyAuthenticatorAuthSchema),
    defaultValues: {
      code: "",
    },
  })
  const { mutate, isPending } = trpc.auth.verifyAuthenticatorAuth.useMutation({
    onSuccess: () => {
      toast.success("Authenticator app verified successfully")
      setErrorMessage(null)
      setIsOpen(false)
      setUserInfo({
        ...userInfo,
        supabaseMetadata: {
          ...userInfo.supabaseMetadata,
          is_authenticator_verified: true,
        },
        authenticatorChallenge: null,
      })
    },
    onError: async (error) => {
      console.error("error", error.message)

      // Determine the error message to display
      const isIncorrectCode =
        error.message.toLowerCase().includes("invalid") ||
        error.message.toLowerCase().includes("incorrect") ||
        error.message.toLowerCase().includes("code")

      setErrorMessage(isIncorrectCode ? "That code was not correct" : "Something went wrong.")
      form.reset({ code: "" })
    },
  })

  const handleOTPChange = (value: string) => {
    form.setValue("code", value, { shouldValidate: true, shouldDirty: true })
    setErrorMessage(null)

    if (value.length === 6) {
      form.trigger("code").then((isValid) => {
        if (isValid) {
          form.handleSubmit((data) => mutate(data))()
        }
      })
    }
  }

  const handleReset = () => {
    form.reset({ code: "" })
    setErrorMessage(null)
    setHasAuthenticator(false)
    setQrCode(null)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className={`space-y-4 ${hasAuthenticator ? "" : "pointer-events-none opacity-30"} transition-opacity duration-200`}
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Enter the 6-digit code from your authenticator app</FormLabel>
              <FormControl>
                <InputOTP
                  disabled={isPending || !hasAuthenticator}
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
              {errorMessage && (
                <p className="text-destructive text-center text-sm">{errorMessage}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isPending}
            className="w-full"
          >
            Start Over
          </Button>
          <Button size="sm" type="submit" isLoading={isPending}>
            Verify Authenticator App
          </Button>
        </div>
      </form>
    </Form>
  )
}
