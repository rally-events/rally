import { Card, CardContent } from "@/components/ui/card"
import { EventEditSchema, useEventEditor } from "../../event-editor-provider"
import { useFormContext } from "react-hook-form"

export default function EventEditorMedia() {
  const { register } = useFormContext<EventEditSchema>()
  const { handleUploadMedia } = useEventEditor()
  return (
    <Card>
      <CardContent></CardContent>
    </Card>
  )
}
