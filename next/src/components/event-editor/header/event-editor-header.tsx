"use client"
import { Button } from "@/components/ui/button"
import {
  ArchiveIcon,
  EyeClosedIcon,
  EyeIcon,
  EyeOffIcon,
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function EventEditorHeader() {
  const router = useRouter()
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" hoverArrowLeft onClick={() => router.back()}>
          Back
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">
          Edited 5 minutes ago by <span className="font-medium underline">You</span>
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-42">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <EyeIcon />
                Visibility
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <EyeIcon />
                  Public
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <EyeOffIcon />
                  Unlisted
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <EyeClosedIcon />
                  Private
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <ArchiveIcon />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
