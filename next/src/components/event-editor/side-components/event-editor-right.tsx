import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { InfoIcon } from "lucide-react"
import React from "react"
import { useEventEditor } from "../event-editor-provider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function EventEditorRight() {
  const { isDirty } = useEventEditor()
  return (
    <>
      <Button>Publish</Button>
      <Separator />
      <Button variant="outline">Preview</Button>
      {!isDirty ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button className="w-full" variant="outline" disabled={true}>
                Save
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>You have no unsaved changes.</TooltipContent>
        </Tooltip>
      ) : (
        <Button variant="outline" disabled={false}>
          Save
        </Button>
      )}
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
