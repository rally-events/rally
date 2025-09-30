/**
 * Media validation utilities for checking file dimensions and duration
 */

export interface ImageValidationResult {
  valid: boolean
  width?: number
  height?: number
  error?: string
}

export interface VideoValidationResult {
  valid: boolean
  width?: number
  height?: number
  duration?: number
  error?: string
}

const MIN_DIMENSION = 250
const MAX_DIMENSION = 8000
const MAX_IMAGE_SIZE = 20 * 1024 * 1024 // 20MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB
const MIN_VIDEO_DURATION = 2 // seconds
const MAX_VIDEO_DURATION = 120 // seconds (2 minutes)

// Poster/Flyer constants
const MIN_POSTER_DIMENSION = 500
const MAX_POSTER_DIMENSION = 12000
const MAX_POSTER_SIZE = 20 * 1024 * 1024 // 20MB
const POSTER_ASPECT_RATIOS = [
  { ratio: 11 / 17, name: "11:17" },
  { ratio: 4 / 5, name: "4:5" },
  { ratio: 9 / 16, name: "9:16" },
  { ratio: 8.5 / 11, name: "8.5:11" },
]
const ASPECT_RATIO_TOLERANCE = 0.02

// PDF constants
const MAX_PDF_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * Validate image file dimensions and size
 */
export async function validateImageDimensions(file: File): Promise<ImageValidationResult> {
  // Check file size first
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Image size exceeds maximum of 20MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    }
  }

  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const { width, height } = img

      // Check minimum dimensions
      if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
        resolve({
          valid: false,
          width,
          height,
          error: `Image dimensions too small. Both width and height must be at least ${MIN_DIMENSION}px (current: ${width}x${height}px)`,
        })
        return
      }

      // Check maximum dimensions
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        resolve({
          valid: false,
          width,
          height,
          error: `Image dimensions too large. Both width and height must be at most ${MAX_DIMENSION}px (current: ${width}x${height}px)`,
        })
        return
      }

      resolve({
        valid: true,
        width,
        height,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({
        valid: false,
        error: "Failed to load image. The file may be corrupted or not a valid image format.",
      })
    }

    img.src = url
  })
}

/**
 * Validate video file dimensions, duration, and size
 */
export async function validateVideoDimensions(file: File): Promise<VideoValidationResult> {
  // Check file size first
  if (file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `Video size exceeds maximum of 100MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    }
  }

  return new Promise((resolve) => {
    const video = document.createElement("video")
    const url = URL.createObjectURL(file)

    video.preload = "metadata"

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)

      const { videoWidth: width, videoHeight: height, duration } = video

      // Check if video has valid dimensions
      if (!width || !height) {
        resolve({
          valid: false,
          error:
            "Unable to read video dimensions. The file may be corrupted or not a valid video format.",
        })
        return
      }

      // Check minimum dimensions
      if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
        resolve({
          valid: false,
          width,
          height,
          duration,
          error: `Video dimensions too small. Both width and height must be at least ${MIN_DIMENSION}px (current: ${width}x${height}px)`,
        })
        return
      }

      // Check maximum dimensions
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        resolve({
          valid: false,
          width,
          height,
          duration,
          error: `Video dimensions too large. Both width and height must be at most ${MAX_DIMENSION}px (current: ${width}x${height}px)`,
        })
        return
      }

      // Check duration
      if (duration < MIN_VIDEO_DURATION) {
        resolve({
          valid: false,
          width,
          height,
          duration,
          error: `Video duration too short. Must be at least ${MIN_VIDEO_DURATION} seconds (current: ${duration.toFixed(1)}s)`,
        })
        return
      }

      if (duration > MAX_VIDEO_DURATION) {
        resolve({
          valid: false,
          width,
          height,
          duration,
          error: `Video duration too long. Must be at most ${MAX_VIDEO_DURATION} seconds (current: ${duration.toFixed(1)}s)`,
        })
        return
      }

      resolve({
        valid: true,
        width,
        height,
        duration,
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({
        valid: false,
        error: "Failed to load video. The file may be corrupted or not a valid video format.",
      })
    }

    video.src = url
  })
}

/**
 * Get file extension from MIME type
 */
export function getFileExtension(mimeType: string): string {
  const parts = mimeType.split("/")
  return parts[1] || "bin"
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

/**
 * Validate poster/flyer image dimensions and aspect ratio
 */
export async function validatePosterDimensions(file: File): Promise<ImageValidationResult> {
  // Check file size first
  if (file.size > MAX_POSTER_SIZE) {
    return {
      valid: false,
      error: `Poster size exceeds maximum of 20MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    }
  }

  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const { width, height } = img

      // Check minimum dimensions
      if (width < MIN_POSTER_DIMENSION || height < MIN_POSTER_DIMENSION) {
        resolve({
          valid: false,
          width,
          height,
          error: `Poster dimensions too small. Both width and height must be at least ${MIN_POSTER_DIMENSION}px (current: ${width}x${height}px)`,
        })
        return
      }

      // Check maximum dimensions
      if (width > MAX_POSTER_DIMENSION || height > MAX_POSTER_DIMENSION) {
        resolve({
          valid: false,
          width,
          height,
          error: `Poster dimensions too large. Both width and height must be at most ${MAX_POSTER_DIMENSION}px (current: ${width}x${height}px)`,
        })
        return
      }

      // Check aspect ratio
      const imageAspectRatio = width / height
      const matchingRatio = POSTER_ASPECT_RATIOS.find(
        ({ ratio }) => Math.abs(imageAspectRatio - ratio) <= ASPECT_RATIO_TOLERANCE,
      )

      if (!matchingRatio) {
        const ratioNames = POSTER_ASPECT_RATIOS.map((r) => r.name).join(", ")
        resolve({
          valid: false,
          width,
          height,
          error: `Poster must have one of these aspect ratios: ${ratioNames}. Current aspect ratio: ${(width / height).toFixed(3)}`,
        })
        return
      }

      resolve({
        valid: true,
        width,
        height,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({
        valid: false,
        error:
          "Failed to load poster image. The file may be corrupted or not a valid image format.",
      })
    }

    img.src = url
  })
}

/**
 * Validate PDF file
 */
export async function validatePDF(file: File): Promise<{ valid: boolean; error?: string }> {
  // Check file type
  if (file.type !== "application/pdf") {
    return {
      valid: false,
      error: "File must be a PDF document",
    }
  }

  // Check file size
  if (file.size > MAX_PDF_SIZE) {
    return {
      valid: false,
      error: `PDF size exceeds maximum of 10MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    }
  }

  return {
    valid: true,
  }
}
