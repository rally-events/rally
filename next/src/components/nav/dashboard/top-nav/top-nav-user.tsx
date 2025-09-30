"use client"

import { useTheme } from "@/components/theme/theme-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserInfo } from "@rally/api"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

export default function TopNavUser({ user }: { user: UserInfo }) {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="override" className="min-w-52 py-1 pr-3 pl-2">
          <div className="flex w-full items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <Avatar>
                <AvatarImage src={""} />
                <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="mr-4 line-clamp-1 text-sm leading-tight font-medium">
                {user.firstName} {user.lastName.charAt(0)}.
              </span>
            </div>
            <ChevronsUpDownIcon className="size-3" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent triggerWidth>
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Themes</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <span className="flex w-full items-center justify-between gap-1">
                Light {theme === "light" && <CheckIcon className="size-3" />}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <span className="flex w-full items-center justify-between gap-1">
                Dark {theme === "dark" && <CheckIcon className="size-3" />}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("auto")}>
              <span className="flex w-full items-center justify-between gap-1">
                System {theme === "auto" && <CheckIcon className="size-3" />}
              </span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>Account Settings</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
