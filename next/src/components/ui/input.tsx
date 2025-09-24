import * as React from "react"

import { cn } from "@/lib/utils"

const inputVariants = {
  size: {
    default: "px-3 h-9",
    sm: "px-2 h-8",
    lg: "px-3.5 h-10",
    xl: "px-4 h-12",
  },
}

type InputSize = keyof typeof inputVariants.size

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  size?: InputSize
}

function Input({ className, type, size = "default", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        inputVariants.size[size],
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
