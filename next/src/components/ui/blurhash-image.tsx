"use client"

import { useState, useEffect, ImgHTMLAttributes } from "react"
import { Blurhash } from "react-blurhash"

interface BlurHashImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  blurhash?: string | null
}

export default function BlurHashImage({ src, blurhash, alt = "", ...props }: BlurHashImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Reset loaded state when src changes
    setIsLoaded(false)
  }, [src])

  // If no blurhash, just render a normal image
  if (!blurhash) {
    return <img src={src} alt={alt} {...props} />
  }

  return (
    <div style={{ position: "relative", display: "inline-block", width: "100%", height: "100%" }}>
      {!isLoaded && (
        <Blurhash
          hash={blurhash}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
          style={{
            zIndex: 10,
            opacity: isLoaded ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        style={{
          zIndex: 0,
          width: "100%",
          height: "100%",
        }}
        {...props}
      />
    </div>
  )
}
