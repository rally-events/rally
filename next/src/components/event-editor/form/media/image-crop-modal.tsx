"use client"

import { useState, useEffect, useRef } from "react"
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
 * Sample the color at the edge of an image
 * Samples 10px inward from the specified edge and averages pixels along that line
 */
function sampleEdgeColor(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  side: "top" | "bottom" | "left" | "right",
  sampleDepth = 10,
): string {
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)

  const numSamples = 20 // Sample 20 points along the edge
  let r = 0,
    g = 0,
    b = 0

  for (let i = 0; i < numSamples; i++) {
    let x = 0,
      y = 0

    switch (side) {
      case "top":
        x = Math.floor((image.width / numSamples) * i)
        y = Math.min(sampleDepth, image.height - 1)
        break
      case "bottom":
        x = Math.floor((image.width / numSamples) * i)
        y = Math.max(0, image.height - sampleDepth - 1)
        break
      case "left":
        x = Math.min(sampleDepth, image.width - 1)
        y = Math.floor((image.height / numSamples) * i)
        break
      case "right":
        x = Math.max(0, image.width - sampleDepth - 1)
        y = Math.floor((image.height / numSamples) * i)
        break
    }

    const pixel = ctx.getImageData(x, y, 1, 1).data
    r += pixel[0]
    g += pixel[1]
    b += pixel[2]
  }

  r = Math.round(r / numSamples)
  g = Math.round(g / numSamples)
  b = Math.round(b / numSamples)

  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Create a cropped image blob from the crop area
 * Fills blank areas with sampled edge colors and applies gradient feathering
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

  const sourceX = Math.max(0, pixelCrop.x)
  const sourceY = Math.max(0, pixelCrop.y)
  const sourceWidth = Math.min(pixelCrop.width, originalWidth - sourceX)
  const sourceHeight = Math.min(pixelCrop.height, originalHeight - sourceY)

  // Calculate destination position (offset if crop started before image bounds)
  const destX = Math.max(0, -pixelCrop.x)
  const destY = Math.max(0, -pixelCrop.y)

  // Determine if there are blank spaces and which sides
  const hasBlankTop = pixelCrop.y < 0
  const hasBlankBottom = pixelCrop.y + pixelCrop.height > originalHeight
  const hasBlankLeft = pixelCrop.x < 0
  const hasBlankRight = pixelCrop.x + pixelCrop.width > originalWidth

  // Sample edge colors if there are blank spaces
  let topColor = "#ffffff"
  let bottomColor = "#ffffff"
  let leftColor = "#ffffff"
  let rightColor = "#ffffff"

  if (hasBlankTop || hasBlankBottom || hasBlankLeft || hasBlankRight) {
    // Create a temporary canvas for sampling
    const sampleCanvas = document.createElement("canvas")
    const sampleCtx = sampleCanvas.getContext("2d")
    if (sampleCtx) {
      if (hasBlankTop) topColor = sampleEdgeColor(sampleCanvas, sampleCtx, image, "top")
      if (hasBlankBottom) bottomColor = sampleEdgeColor(sampleCanvas, sampleCtx, image, "bottom")
      if (hasBlankLeft) leftColor = sampleEdgeColor(sampleCanvas, sampleCtx, image, "left")
      if (hasBlankRight) rightColor = sampleEdgeColor(sampleCanvas, sampleCtx, image, "right")
    }
  }

  // Fill blank areas with sampled colors
  if (hasBlankTop) {
    ctx.fillStyle = topColor
    ctx.fillRect(0, 0, canvas.width, destY)
  }
  if (hasBlankBottom) {
    ctx.fillStyle = bottomColor
    ctx.fillRect(0, destY + sourceHeight, canvas.width, canvas.height - (destY + sourceHeight))
  }
  if (hasBlankLeft) {
    ctx.fillStyle = leftColor
    ctx.fillRect(0, 0, destX, canvas.height)
  }
  if (hasBlankRight) {
    ctx.fillStyle = rightColor
    ctx.fillRect(destX + sourceWidth, 0, canvas.width - (destX + sourceWidth), canvas.height)
  }

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

  // Apply gradient feathering at the boundaries (5% of image dimension)
  const verticalGradientLength = originalHeight * 0.05
  const horizontalGradientLength = originalWidth * 0.05

  if (hasBlankTop && destY > 0) {
    const gradient = ctx.createLinearGradient(0, destY, 0, destY + verticalGradientLength)
    gradient.addColorStop(0, topColor)
    gradient.addColorStop(1, topColor.replace("rgb", "rgba").replace(")", ", 0)"))
    ctx.fillStyle = gradient
    ctx.fillRect(0, destY, canvas.width, Math.min(verticalGradientLength, sourceHeight))
  }

  if (hasBlankBottom && destY + sourceHeight < canvas.height) {
    const gradientStart = destY + sourceHeight - verticalGradientLength
    const gradient = ctx.createLinearGradient(0, gradientStart, 0, destY + sourceHeight)
    gradient.addColorStop(0, bottomColor.replace("rgb", "rgba").replace(")", ", 0)"))
    gradient.addColorStop(1, bottomColor)
    ctx.fillStyle = gradient
    ctx.fillRect(0, Math.max(destY, gradientStart), canvas.width, verticalGradientLength)
  }

  if (hasBlankLeft && destX > 0) {
    const gradient = ctx.createLinearGradient(destX, 0, destX + horizontalGradientLength, 0)
    gradient.addColorStop(0, leftColor)
    gradient.addColorStop(1, leftColor.replace("rgb", "rgba").replace(")", ", 0)"))
    ctx.fillStyle = gradient
    ctx.fillRect(destX, 0, Math.min(horizontalGradientLength, sourceWidth), canvas.height)
  }

  if (hasBlankRight && destX + sourceWidth < canvas.width) {
    const gradientStart = destX + sourceWidth - horizontalGradientLength
    const gradient = ctx.createLinearGradient(gradientStart, 0, destX + sourceWidth, 0)
    gradient.addColorStop(0, rightColor.replace("rgb", "rgba").replace(")", ", 0)"))
    gradient.addColorStop(1, rightColor)
    ctx.fillStyle = gradient
    ctx.fillRect(Math.max(destX, gradientStart), 0, horizontalGradientLength, canvas.height)
  }

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
  const [imageData, setImageData] = useState<{
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
        img.onload = async () => {
          const aspect = img.width / img.height
          setImageData({ width: img.width, height: img.height, aspect: aspect })
          if (aspect > ASPECT_RATIOS[selectedAspectRatio]) {
            const previewWidth = (img.height * ASPECT_RATIOS[selectedAspectRatio]) / img.width
            setMinZoom(previewWidth)
          } else {
            const previewHeight = (img.width * ASPECT_RATIOS[selectedAspectRatio]) / img.height
            setMinZoom(previewHeight)
          }
          setZoom(1)
          setCrop({ x: 0, y: 0 })
          setSelectedAspectRatio(selectedAspectRatio)
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }, [file, open])

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const onSelectAspectRatio = (aspectRatio: "1:1" | "4:5" | "5:4") => {
    if (!imageData) return
    const aspect = ASPECT_RATIOS[aspectRatio]
    if (imageData.aspect > aspect) {
      const previewWidth = (imageData.height * aspect) / imageData.width
      setMinZoom(previewWidth)
    } else {
      const previewHeight = (imageData.width * aspect) / imageData.height
      setMinZoom(previewHeight)
    }

    if (zoom < 1) {
      setZoom(1)
      if (imageData.aspect > ASPECT_RATIOS[aspectRatio]) {
        setCrop({ x: 0, y: crop.y })
      } else {
        setCrop({ x: crop.x, y: 0 })
      }
    }
    setSelectedAspectRatio(aspectRatio)
  }

  const handleCropChange = (newCrop: Point) => {
    const cropper = cropperRef.current
    if (!imageData) {
      setCrop(newCrop)
      return
    }
    if (!cropper) {
      setCrop(newCrop)
      return
    }
    const cropSize = cropper.state.cropSize!
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
      if (imageData.aspect < ASPECT_RATIOS[selectedAspectRatio]) {
        restrictedCrop.x = 0
      } else {
        restrictedCrop.y = 0
      }
    }

    setCrop(restrictedCrop)
  }

  const handleZoomChange = (newZoom: number) => {
    if (!imageData) return
    if (newZoom < 1) {
      if (imageData.aspect < ASPECT_RATIOS[selectedAspectRatio]) {
        setCrop({ x: 0, y: crop.y })
      } else {
        setCrop({ x: crop.x, y: 0 })
      }
    }
    setZoom(newZoom)
  }

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc || !imageData) return

    try {
      setIsProcessing(true)
      const croppedBlob = await getCroppedImage(
        imageSrc,
        croppedAreaPixels,
        imageData.width,
        imageData.height,
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
    setImageData(null)
    onClose()
  }

  if (!imageSrc) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent noTransforms showCloseButton={false}>
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
