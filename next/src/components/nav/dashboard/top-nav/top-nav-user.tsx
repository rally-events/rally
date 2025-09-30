"use client"

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
import { ChevronsUpDownIcon } from "lucide-react"

export default function TopNavUser({ user }: { user: UserInfo }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="override" className="py-2 pr-3 pl-2">
          <div className="flex items-center gap-1">
            <Avatar>
              <AvatarImage src={""} />
              <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mr-4 flex flex-col items-start">
              <span className="line-clamp-1 text-sm leading-tight font-medium">
                {user.firstName} {user.lastName.charAt(0)}.
              </span>
              <span className="text-muted-foreground line-clamp-1 text-xs leading-tight">
                {user.email}
              </span>
            </div>
            <ChevronsUpDownIcon className="size-3" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent triggerWidth>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Themes</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Light</DropdownMenuItem>
            <DropdownMenuItem>Dark</DropdownMenuItem>
            <DropdownMenuItem>System</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>Account Settings</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
