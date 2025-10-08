import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatFileSize } from "@/lib/media-utils"
import { MediaInfo } from "@rally/api"
import { format } from "date-fns"
import { XIcon, ZoomInIcon } from "lucide-react"
import React, { useState } from "react"

interface EventEditorMediaPreviewProps {
  media: MediaInfo
  handleDelete: (mediaId: string) => void
  deleteMedia: {
    isPending: boolean
  }
  isPoster?: boolean
}

export default function EventEditorMediaPreview({
  media,
  handleDelete,
  deleteMedia,
  isPoster = false,
}: EventEditorMediaPreviewProps) {
  const [isPreviewingImage, setIsPreviewingImage] = useState(false)
  return (
    <>
      <Dialog open={isPreviewingImage} onOpenChange={setIsPreviewingImage}>
        <DialogContent className="!max-w-144">
          <DialogHeader>
            <DialogTitle>{media.media.fileName.replace(".webp", "")}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Uploaded on {format(media.media.createdAt, "MMM d, yyyy")},{" "}
            {formatFileSize(media.media.fileSize)}
          </DialogDescription>
          <img
            src={media.downloadUrl}
            alt={media.media.fileName}
            style={{ aspectRatio: media.media.aspectRatio?.replace(":", "/") || "1/1" }}
            className="mx-auto h-full w-full max-w-124 rounded-lg shadow-lg"
          />
        </DialogContent>
      </Dialog>
      <div className="flex flex-col items-center gap-1">
        <div className="group relative cursor-pointer" onClick={() => setIsPreviewingImage(true)}>
          <img
            src={media.downloadUrl}
            alt={media.media.fileName}
            style={{ aspectRatio: media.media.aspectRatio?.replace(":", "/") || "1/1" }}
            className={`h-full rounded-md object-cover ${isPoster ? "max-w-64" : "max-h-44"}`}
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomInIcon className="size-8 text-white" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 px-1">
          <div className="flex flex-col">
            <span
              className={`text-ellipsis, line-clamp-1 text-sm leading-tight ${isPoster ? "max-w-52" : "max-w-24"}`}
            >
              {media.media.fileName.replace(".webp", "")}
            </span>
            <span
              className={`text-muted-foreground line-clamp-1 ${isPoster ? "max-w-52" : "max-w-24"} text-xs leading-tight text-ellipsis`}
            >
              {format(media.media.createdAt, "MMM d, yyyy")}
            </span>
            <span
              className={`text-muted-foreground line-clamp-1 ${isPoster ? "max-w-52" : "max-w-24"} text-xs leading-tight text-ellipsis`}
            >
              {formatFileSize(media.media.fileSize)}
            </span>
          </div>
          <Button
            className="shrink-0"
            size="iconSm"
            variant="destructive"
            onClick={() => handleDelete(media.mediaId)}
            isLoading={deleteMedia.isPending}
            disabled={deleteMedia.isPending}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}
