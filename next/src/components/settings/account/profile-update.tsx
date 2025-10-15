import { UserInfo } from "@rally/api"
import { useForm } from "react-hook-form"
import React from "react"
import { updateUserProfileSchema } from "@rally/schemas"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/trpc/client"
import { toast } from "sonner"

interface ProfileUpdateProps {
  user: UserInfo
}

export default function ProfileUpdate({ user }: ProfileUpdateProps) {
  const form = useForm<z.infer<typeof updateUserProfileSchema>>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  })
  const { mutate: updateUserProfile, isPending } = api.user.updateUserProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully")
      form.reset()
    },
    onError: () => {
      toast.error("Failed to update profile")
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Update</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => updateUserProfile(data))}
            className="space-y-8"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input size="lg" placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input size="lg" placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          type="button"
          disabled={!form.formState.isDirty || isPending}
          variant="outline"
          onClick={() => form.reset()}
        >
          Undo Changes
        </Button>
        <Button
          type="submit"
          isLoading={isPending}
          disabled={!form.formState.isDirty}
          onClick={form.handleSubmit((data) => {
            updateUserProfile(data)
            form.reset(data)
          })}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}
