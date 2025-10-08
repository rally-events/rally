"use client"

import { useCallback, useState, useEffect, useRef } from "react"
import Cropper from "react-easy-crop"
import type { Area, Point } from "react-easy-crop"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import "react-easy-crop/react-easy-crop.css"

interface ImageCropModalProps {
  open: boolean
  onClose: () => void
  file: File
  mediaType: "image" | "poster"
  suggestedAspectRatio?: "1:1" | "4:5" | "5:4"
  onSave: (croppedBlob: Blob, aspectRatio: "1:1" | "4:5" | "5:4") => void
}

const ASPECT_RATIOS = {
  "1:1": 1,
  "4:5": 4 / 5,
  "5:4": 5 / 4,
} as const

function restrictPositionCoord(
  position: number,
  mediaSize: number,
  cropSize: number,
  zoom: number,
): number {
  const maxPosition = (mediaSize * zoom) / 2 - cropSize / 2
  return clamp(position, -maxPosition, maxPosition)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Create a cropped image blob from the crop area
 * Fills any transparent areas with white background
 */
async function getCroppedImage(
  imageSrc: string,
  pixelCrop: Area,
  originalWidth: number,
  originalHeight: number,
): Promise<Blob> {
  const image = new Image()
  image.src = imageSrc

  await new Promise((resolve, reject) => {
    image.onload = resolve
    image.onerror = reject
  })

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Failed to get canvas context")
  }

  // Set canvas size to the crop area size
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Fill with white background first (for any transparent areas when zoomed out)
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Calculate the portion of the image to draw
  // When zoomed out, the crop area may extend beyond the image bounds
  const sourceX = Math.max(0, pixelCrop.x)
  const sourceY = Math.max(0, pixelCrop.y)
  const sourceWidth = Math.min(pixelCrop.width, originalWidth - sourceX)
  const sourceHeight = Math.min(pixelCrop.height, originalHeight - sourceY)

  // Calculate destination position (offset if crop started before image bounds)
  const destX = Math.max(0, -pixelCrop.x)
  const destY = Math.max(0, -pixelCrop.y)

  // Draw the cropped portion of the image
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    destX,
    destY,
    sourceWidth,
    sourceHeight,
  )

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create blob from canvas"))
        return
      }
      resolve(blob)
    }, "image/png")
  })
}

export default function ImageCropModal({
  open,
  onClose,
  file,
  mediaType,
  suggestedAspectRatio = "4:5",
  onSave,
}: ImageCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<"1:1" | "4:5" | "5:4">(
    suggestedAspectRatio,
  )
  const [imageSize, setImageSize] = useState<{
    width: number
    height: number
    aspect: number
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [minZoom, setMinZoom] = useState(0.1)
  const cropperRef = useRef<Cropper>(null)
  // Load image when file changes
  useEffect(() => {
    if (file && open) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)

        // Get image dimensions
        const img = new Image()
        img.onload = () => {
          const aspect = img.width / img.height
          setImageSize({ width: img.width, height: img.height, aspect: aspect })
          if (aspect > ASPECT_RATIOS[selectedAspectRatio]) {
            const previewWidth = (img.height * ASPECT_RATIOS[selectedAspectRatio]) / img.width
            setMinZoom(previewWidth)
          } else {
            const previewHeight = (img.width * ASPECT_RATIOS[selectedAspectRatio]) / img.height
            setMinZoom(previewHeight)
          }
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }, [file, open])

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const onSelectAspectRatio = (aspectRatio: "1:1" | "4:5" | "5:4") => {
    if (!imageSize) return
    const aspect = ASPECT_RATIOS[aspectRatio]
    if (imageSize.aspect > aspect) {
      const previewWidth = (imageSize.height * aspect) / imageSize.width
      setMinZoom(previewWidth)
    } else {
      const previewHeight = (imageSize.width * aspect) / imageSize.height
      setMinZoom(previewHeight)
    }

    if (zoom < 1) {
      setZoom(1)
      if (imageSize.aspect > ASPECT_RATIOS[aspectRatio]) {
        setCrop({ x: 0, y: crop.y })
      } else {
        setCrop({ x: crop.x, y: 0 })
      }
    }
    setSelectedAspectRatio(aspectRatio)
  }

  const handleCropChange = (newCrop: Point) => {
    const cropper = cropperRef.current
    if (!imageSize) {
      setCrop(newCrop)
      return
    }
    if (!cropper) {
      setCrop(newCrop)
      return
    }

    const cropSize = cropper.state.cropSize
    const mediaSize = cropper.mediaSize

    if (!cropSize || !mediaSize) {
      setCrop(newCrop)
      return
    }

    const restrictedCrop = {
      x: restrictPositionCoord(newCrop.x, mediaSize.width, cropSize.width, zoom),
      y: restrictPositionCoord(newCrop.y, mediaSize.height, cropSize.height, zoom),
    }

    if (zoom < 1) {
      if (imageSize.aspect < ASPECT_RATIOS[selectedAspectRatio]) {
        restrictedCrop.x = 0
      } else {
        restrictedCrop.y = 0
      }
    }

    setCrop(restrictedCrop)
  }

  const handleZoomChange = (newZoom: number) => {
    if (!imageSize) return
    if (newZoom < 1) {
      if (imageSize.aspect < ASPECT_RATIOS[selectedAspectRatio]) {
        setCrop({ x: 0, y: crop.y })
      } else {
        setCrop({ x: crop.x, y: 0 })
      }
    }
    setZoom(newZoom)
  }

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc || !imageSize) return

    try {
      setIsProcessing(true)
      const croppedBlob = await getCroppedImage(
        imageSrc,
        croppedAreaPixels,
        imageSize.width,
        imageSize.height,
      )
      onSave(croppedBlob, selectedAspectRatio)
      handleClose()
    } catch (error) {
      console.error("Failed to crop image:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setImageSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setImageSize(null)
    onClose()
  }

  if (!imageSrc) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-4xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            {mediaType === "poster"
              ? "Adjust your poster to fit the 4:5 aspect ratio"
              : "Select an aspect ratio and adjust your image to fit"}
          </DialogDescription>
        </DialogHeader>

        {/* Aspect Ratio Selector - Only for general images */}
        {mediaType === "image" && (
          <div className="flex items-center justify-center gap-2">
            {(Object.keys(ASPECT_RATIOS) as Array<keyof typeof ASPECT_RATIOS>).map((ratio) => (
              <Button
                key={ratio}
                variant={selectedAspectRatio === ratio ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectAspectRatio(ratio)}
              >
                {ratio}
              </Button>
            ))}
          </div>
        )}

        {/* Cropper */}
        <div className="relative h-[400px] w-full bg-black/5">
          <Cropper
            ref={cropperRef}
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={ASPECT_RATIOS[selectedAspectRatio]}
            onCropChange={handleCropChange}
            onZoomChange={handleZoomChange}
            onCropComplete={onCropComplete}
            minZoom={minZoom}
            maxZoom={3}
            objectFit="contain"
            restrictPosition={false}
            showGrid={true}
            style={{
              containerStyle: {
                backgroundColor: "#f5f5f5",
              },
              cropAreaStyle: {
                border: "1px solid #3b82f6",
              },
            }}
          />
        </div>

        {/* Zoom Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Zoom</span>
            <span className="text-muted-foreground">{Math.round(zoom * 100)}%</span>
          </div>
          <Slider
            min={minZoom}
            max={3}
            step={0.01}
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isProcessing} isLoading={isProcessing}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
