"use client"

import { useCallback, useState, useEffect } from "react"
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
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [minZoom, setMinZoom] = useState(0.1)
  const [lockThreshold, setLockThreshold] = useState(1)

  // Load image when file changes
  useEffect(() => {
    if (file && open) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)

        // Get image dimensions
        const img = new Image()
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height })
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }, [file, open])

  // Calculate minimum zoom based on aspect ratios
  // This allows the user to zoom out until the shortest edge touches the crop boundary
  useEffect(() => {
    if (!imageSize) return

    const aspect = ASPECT_RATIOS[selectedAspectRatio]
    const imageAspect = imageSize.width / imageSize.height

    // If image is wider than crop aspect, height is the limiting dimension
    // If image is taller than crop aspect, width is the limiting dimension
    let calculatedMinZoom: number

    if (imageAspect > aspect) {
      // Image is wider - height will touch first when zooming out
      // We want minZoom such that image height = crop height
      calculatedMinZoom = aspect / imageAspect
    } else {
      // Image is taller - width will touch first when zooming out
      // We want minZoom such that image width = crop width
      calculatedMinZoom = imageAspect / aspect
    }

    // Set a reasonable minimum (don't go below 10% of original size)
    setMinZoom(Math.max(0.1, calculatedMinZoom * 0.95))

    // Set the lock threshold - this is the zoom level where the image exactly fits
    // the crop area on its shortest dimension
    setLockThreshold(calculatedMinZoom)
  }, [imageSize, selectedAspectRatio])

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropChange = useCallback(
    (location: Point) => {
      // If zoom is at or below the lock threshold, force the image to be centered
      // This prevents panning when the image doesn't fully cover the crop area
      if (zoom <= lockThreshold) {
        setCrop({ x: 0, y: 0 })
      } else {
        setCrop(location)
      }
    },
    [zoom, lockThreshold],
  )

  // Reset crop position to center when zoom drops below threshold
  useEffect(() => {
    if (zoom <= lockThreshold) {
      setCrop({ x: 0, y: 0 })
    }
  }, [zoom, lockThreshold])

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

  const aspect = ASPECT_RATIOS[selectedAspectRatio]

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
                onClick={() => setSelectedAspectRatio(ratio)}
              >
                {ratio}
              </Button>
            ))}
          </div>
        )}

        {/* Cropper */}
        <div className="relative h-[400px] w-full bg-black/5">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={handleCropChange}
            onZoomChange={setZoom}
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
                border: "2px solid #3b82f6",
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
