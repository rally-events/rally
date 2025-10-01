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
import { useEventEditor } from "../event-editor-provider"
import { formatDistanceToNow } from "date-fns"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function EventEditorHeader() {
  const router = useRouter()
  const { lastUpdated, saveStatus } = useEventEditor()

  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" hoverArrowLeft onClick={() => router.back()}>
          Back
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger className="-mr-1 p-1 outline-none">
            <div
              className={`size-1.5 rounded-full transition-colors duration-150 ${saveStatus === "saving" && "bg-muted-foreground"} ${saveStatus === "saved" && "bg-green-500"} ${saveStatus === "error" && "bg-red-500"} `}
            />
          </TooltipTrigger>
          <TooltipContent>
            {saveStatus === "saving" && "Saving changes..."}
            {saveStatus === "saved" && "Up to date"}
            {saveStatus === "error" && "Error saving changes"}
          </TooltipContent>
        </Tooltip>
        <span className="text-muted-foreground text-sm">
          Edited {formatDistanceToNow(lastUpdated, { addSuffix: true })}
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
