import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input, InputProps } from "./input"

interface PasswordInputProps extends InputProps {
  className?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
