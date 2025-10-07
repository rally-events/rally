"use client"
import React, { useState } from "react"
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
import Link from "next/link"
import HostEventDeleteModal from "./host-event-delete-modal"
interface HostDataTableDropdownProps {
  row: Row<EventRow>
  handleDeleteEvent: () => void
  deleteEventPending: boolean
}

export default function HostDataTableDropdown({
  row,
  handleDeleteEvent,
  deleteEventPending,
}: HostDataTableDropdownProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  return (
    <>
      <HostEventDeleteModal
        event={row.original}
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onDelete={async () => {
          setIsDeleteModalOpen(false)
          await new Promise((resolve) => setTimeout(resolve, 150))
          handleDeleteEvent()
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="iconSm">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/event/${row.original.id}`}>
              <EyeIcon />
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/event/${row.original.id}/edit`}>
              <EditIcon />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setIsDeleteModalOpen(true)
            }}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
