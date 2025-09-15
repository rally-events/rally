"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type InputOTPVariant = "default" | "gaps"

const InputOTPVariantContext = React.createContext<InputOTPVariant>("default")

function InputOTP({
  className,
  containerClassName,
  variant = "default",
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
  variant?: InputOTPVariant
}) {
  return (
    <InputOTPVariantContext.Provider value={variant}>
      <OTPInput
        data-slot="input-otp"
        data-variant={variant}
        containerClassName={cn(
          "flex items-center has-disabled:opacity-50",
          variant === "default" ? "gap-2" : "gap-4",
          containerClassName
        )}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
      />
    </InputOTPVariantContext.Provider>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  const variant = React.useContext(InputOTPVariantContext)
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center",
        variant === "gaps" ? "gap-2" : "",
        className
      )}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}
  const variant = React.useContext(InputOTPVariantContext)

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        variant === "default"
          ? "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]"
          : "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-12 w-12 items-center justify-center border rounded-md text-sm shadow-xs transition-all outline-none data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
