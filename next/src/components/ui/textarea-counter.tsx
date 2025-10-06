import * as React from "react"

import { cn } from "@/lib/utils"
import { Textarea } from "./textarea"

interface TextareaCounterProps extends React.ComponentProps<"textarea"> {
  max?: number
}

function TextareaCounter({ className, max, ...props }: TextareaCounterProps) {
  const [count, setCount] = React.useState(
    props.value?.toString().length || props.defaultValue?.toString().length || 0,
  )

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCount(e.target.value.length)
    props.onChange?.(e)
  }

  return (
    <div className="relative">
      <Textarea
        className={cn(className, "pb-8")}
        {...props}
        maxLength={max}
        onChange={handleChange}
      />
      <div className="text-muted-foreground absolute right-1 -bottom-4 text-xs">
        {max ? `${count}/${max}` : count}
      </div>
    </div>
  )
}

export { TextareaCounter }
