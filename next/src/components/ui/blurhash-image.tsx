"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect, ImgHTMLAttributes } from "react"
import { Blurhash } from "react-blurhash"

interface BlurHashImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  aspectRatio?: string | null
  blurhash?: string | null
}

export default function BlurHashImage({
  src,
  blurhash,
  alt = "",
  aspectRatio,
  ...props
}: BlurHashImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Reset loaded state when src changes
    setIsLoaded(false)
  }, [src])

  if (!src) {
    return (
      <div
        style={{ aspectRatio: aspectRatio ? aspectRatio.replace(":", "/") : "1/1" }}
        className={cn(
          "relative flex items-center justify-center overflow-hidden border-2 border-dashed",
          props.className,
        )}
      >
        <p className="text-muted-foreground text-sm">No image</p>
      </div>
    )
  }

  // If no blurhash, just render a normal image
  if (!blurhash) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ aspectRatio: aspectRatio ? aspectRatio.replace(":", "/") : undefined }}
        {...props}
      />
    )
  }

  return (
    <div
      style={{ aspectRatio: "1/1" }}
      // style={{ aspectRatio: aspectRatio ? aspectRatio.replace(":", "/") : undefined }}
      className={cn("relative overflow-hidden", props.className)}
    >
      <Blurhash
        hash={blurhash}
        width="100%"
        height="100%"
        resolutionX={32}
        resolutionY={32}
        punch={1}
        style={{
          opacity: isLoaded ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
        className="absolute inset-0 z-10 h-full w-full transition-opacity duration-300"
      />
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        {...props}
        className={"absolute inset-0 z-0 h-full w-full object-cover object-center"}
      />
    </div>
  )
}
