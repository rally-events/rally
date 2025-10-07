"use client"
import { MediaInfo } from "@rally/api"
import React from "react"
import BlurHashImage from "../ui/blurhash-image"
import { Blurhash } from "react-blurhash"

export default function EventViewPoster({ poster }: { poster: MediaInfo }) {
  console.log(poster.media)
  return (
    <div className="relative aspect-[9/16] rounded-lg border">
      <BlurHashImage src={poster.downloadUrl} blurhash={poster.media.blurhash} />
    </div>
  )
}
