"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MultiSelectOption } from "./multi-select"

export function SelectSearch({
  options,
  placeholder,
  value,
  onChange,
  onBlur,
  name,
  ...rest
}: {
  options: MultiSelectOption[]
  placeholder: string
  value?: string
  onChange:
    | ((value: string) => void)
    | ((event: { target: { value: string; name?: string } }) => void)
  onBlur?: (() => void) | ((event: any) => void)
  name?: string
} & Omit<React.ComponentPropsWithoutRef<typeof Button>, "onChange" | "value" | "onBlur">) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [allOptions, setAllOptions] = React.useState(() => {
    // If there's a value that doesn't exist in options, add it
    if (value && !options.find((opt) => opt.value === value)) {
      const label = value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      return [...options, { value, label }]
    }
    return options
  })

  const createValueFromLabel = (label: string) => {
    return label.toLowerCase().replace(/\s+/g, "-")
  }

  const handleValueChange = (newValue: string) => {
    // Support both React Hook Form's onChange (expects event) and regular onChange
    const event = { target: { value: newValue, name } } as any
    ;(onChange as any)(event)
  }

  const handleCreateOption = (label: string) => {
    const newValue = createValueFromLabel(label)
    const newOption: MultiSelectOption = {
      label,
      value: newValue,
    }
    setAllOptions([...allOptions, newOption])
    handleValueChange(newValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          onBlur={onBlur}
          {...rest}
        >
          {value ? allOptions.find((option) => option.value === value)?.label : placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search framework..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty className="p-1">
              <button
                onClick={() => handleCreateOption(searchQuery)}
                className="hover:bg-accent hover:text-accent-foreground w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm"
              >
                Create &quot;{searchQuery}&quot;
              </button>
            </CommandEmpty>
            <CommandGroup>
              {allOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    handleValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
