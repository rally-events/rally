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
}

export default function EventEditorMediaPreview({
  media,
  handleDelete,
  deleteMedia,
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
      <div className="flex flex-col gap-1">
        <div className="group relative cursor-pointer" onClick={() => setIsPreviewingImage(true)}>
          <img
            src={media.downloadUrl}
            alt={media.media.fileName}
            style={{ aspectRatio: media.media.aspectRatio?.replace(":", "/") || "1/1" }}
            className="h-full max-h-44 rounded-md object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomInIcon className="size-8 text-white" />
          </div>
        </div>

        <div className="px-auto flex items-center justify-between gap-1 px-1">
          <div className="flex flex-col">
            <span className="line-clamp-1 max-w-24 text-sm leading-tight text-ellipsis">
              {media.media.fileName.replace(".webp", "")}
              {media.media.fileName.replace(".webp", "")}
              {media.media.fileName.replace(".webp", "")}
              {media.media.fileName.replace(".webp", "")}
              {media.media.fileName.replace(".webp", "")}
            </span>
            <span className="text-muted-foreground line-clamp-1 max-w-32 text-xs leading-tight text-ellipsis">
              {format(media.media.createdAt, "MMM d, yyyy")}
            </span>
            <span className="text-muted-foreground line-clamp-1 max-w-32 text-xs leading-tight text-ellipsis">
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
