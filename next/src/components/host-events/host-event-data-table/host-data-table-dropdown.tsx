import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditIcon, EyeIcon, MoreVertical, ShareIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Row } from "@tanstack/react-table"
import { EventRow } from "./host-events-data-table"
interface HostDataTableDropdownProps {
  row: Row<EventRow>
}

export default function HostDataTableDropdown({ row }: HostDataTableDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="iconSm">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <EyeIcon />
          View
        </DropdownMenuItem>
        <DropdownMenuItem>
          <EditIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShareIcon />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
