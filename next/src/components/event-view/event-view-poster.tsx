"use client"
import { MediaInfo } from "@rally/api"
import React from "react"
import BlurHashImage from "../ui/blurhash-image"

export default function EventViewPoster({ poster }: { poster: MediaInfo }) {
  return (
    <div className="sticky top-[15vh] h-[60vh]">
      <BlurHashImage
        src={poster.downloadUrl}
        blurhash={poster.media.blurhash}
        aspectRatio={poster.media.aspectRatio || "4:5"}
        className="h-full w-full overflow-hidden rounded-xl"
      />
    </div>
  )
}
