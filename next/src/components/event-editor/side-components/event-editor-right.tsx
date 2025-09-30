import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { InfoIcon } from "lucide-react"
import React from "react"

export default function EventEditorRight() {
  return (
    <>
      <Button>Publish</Button>
      <Separator />
      <Button variant="outline">Preview</Button>
      <Button variant="outline">Save</Button>
      <Separator />
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5">
            <InfoIcon className="size-4" />
            Did you know
          </CardTitle>
          <CardDescription>
            You can publish your event to the public by clicking the publish button.
          </CardDescription>
        </CardHeader>
      </Card>
    </>
  )
}
