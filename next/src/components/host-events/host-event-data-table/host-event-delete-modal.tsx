"use client"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import React from "react"
import { EventRow } from "./host-events-data-table"
import { EventInfo } from "@rally/api"

interface HostEventDeleteModalProps {
  event: EventInfo | EventRow
  isOpen: boolean
  onDelete: () => void
  onOpenChange: (open: boolean) => void
}

export default function HostEventDeleteModal({
  event,
  isOpen,
  onOpenChange,
  onDelete,
}: HostEventDeleteModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Event</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this event?{" "}
            <strong>ADD MORE COPY HERE ABOUT IDEK JUST MAKE IT PRETTY</strong> event name:{" "}
            {event.name}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="ghost">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
