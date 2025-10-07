"use client"
import { MediaInfo } from "@rally/api"
import React from "react"
import BlurHashImage from "../ui/blurhash-image"

export default function EventViewPoster({ poster }: { poster: MediaInfo }) {
  return (
    <div className="sticky top-20 h-[80vh]">
      <BlurHashImage
        src={poster.downloadUrl}
        blurhash={poster.media.blurhash}
        aspectRatio={poster.media.posterAspectRatio || "9:16"}
        className="h-full w-full overflow-hidden rounded-xl"
      />
    </div>
  )
}
