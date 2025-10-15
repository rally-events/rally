import VerifyForm from "@/components/auth/verify-form"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { UserInfo } from "@rally/api"
import React, { useState } from "react"

interface VerifyEmailModalProps {
  user: UserInfo
}

export default function VerifyEmailModal({ user }: VerifyEmailModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Verify Email</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify Email</AlertDialogTitle>
          <AlertDialogDescription>Verify your email address to continue.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center py-8">
          <VerifyForm inModal={true} />
        </div>
        <AlertDialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Verify Email</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
