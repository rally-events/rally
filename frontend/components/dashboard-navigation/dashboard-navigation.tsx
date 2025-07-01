import {
  ChevronUpIcon,
  HelpCircleIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"
import { Button, buttonVariants } from "../ui/button"
import { Separator } from "../ui/separator"
import ClientNavigation from "./client-navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../ui/avatar"

export default function DashboardNavigation() {
  return (
    <div className="fixed left-0 top-0 w-72 flex flex-col p-4 justify-between min-h-screen border-r">
      <div className="flex flex-col">
        <div className="h-12 w-12 bg-black/50 rounded-md"></div>
        <Separator className="my-4" />
        <ClientNavigation />
      </div>
      <div className="flex flex-col gap-0.5">
        <Button variant="ghost" className="justify-start gap-2">
          <HelpCircleIcon />
          Support
        </Button>
        <Button variant="ghost" className="justify-start gap-2">
          <SettingsIcon />
          Settings
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 p-2 mt-2 border rounded-md group hover:bg-muted transition-colors duration-75">
              <Avatar>
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <p className="text-sm font-medium leading-tight">
                  Dominic Clerici
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  dominic@rally.com
                </p>
              </div>
              <ChevronUpIcon className="ml-auto h-4 w-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-x-180" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dropdown-content-width-full">
            <DropdownMenuLabel>dominic@rally.com</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon />
              Action 1
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserIcon />
              Action 2
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserIcon />
              Action 3
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
