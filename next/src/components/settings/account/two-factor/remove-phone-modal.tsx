"use client"
import React, { useState } from "react"
import { UserInfo } from "@rally/api"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { api } from "@/lib/trpc/client"

interface RemovePhoneModalProps {
  user: UserInfo
}

export default function RemovePhoneModal({ user }: RemovePhoneModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { error, mutate, isPending } = api.auth.removePhoneAuth.useMutation({
    onSuccess: () => {
      toast.success("Phone number removed successfully")
    },
    onError: async (error) => {
      console.error("error", error.message)
      toast.error(error.message)
    },
  })
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Remove Phone Number</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Phone Number</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove your phone number?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await mutate()
              setIsOpen(false)
            }}
            isLoading={isPending}
          >
            {isPending ? "Removing..." : "Remove Phone Number"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
