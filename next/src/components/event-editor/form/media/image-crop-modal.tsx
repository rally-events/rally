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

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
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

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

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
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="contain"
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
            min={1}
            max={1.5}
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
