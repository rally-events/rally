"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEventEditor } from "../../event-editor-provider"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { api } from "@/lib/trpc/client"
import { validateImageDimensions, validateVideoDimensions, validatePosterDimensions, validatePDF, formatFileSize } from "@/lib/media-utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload, Image as ImageIcon, Video as VideoIcon, FileImage, FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface UploadedMedia {
  id: string
  url: string
  type: "image" | "video" | "poster" | "pdf"
  fileName: string
  fileSize: number
}

interface UploadProgress {
  fileName: string
  progress: number
  error?: string
}

export default function EventEditorMedia() {
  const { eventId, uploadedMedia, setUploadedMedia } = useEventEditor()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({})

  const generateUploadUrl = api.media.generateUploadUrl.useMutation()
  const confirmUpload = api.media.confirmUpload.useMutation()
  const deleteMedia = api.media.deleteMedia.useMutation()

  const images = uploadedMedia.filter((m) => m.type === "image")
  const video = uploadedMedia.find((m) => m.type === "video")
  const poster = uploadedMedia.find((m) => m.type === "poster")
  const pdfs = uploadedMedia.filter((m) => m.type === "pdf")

  const handleUploadFile = useCallback(
    async (file: File, mediaType: "image" | "video" | "poster" | "pdf") => {
      const isVideo = file.type.startsWith("video/")
      const isPDF = file.type === "application/pdf"
      const isPoster = mediaType === "poster"
      const progressKey = file.name

      try {
        setUploadProgress((prev) => ({
          ...prev,
          [progressKey]: { fileName: file.name, progress: 0 },
        }))

        // Validate dimensions and duration
        let width: number | undefined
        let height: number | undefined
        let duration: number | undefined

        if (isPDF) {
          const validation = await validatePDF(file)
          if (!validation.valid) {
            throw new Error(validation.error)
          }
        } else if (isPoster) {
          const validation = await validatePosterDimensions(file)
          if (!validation.valid) {
            throw new Error(validation.error)
          }
          width = validation.width!
          height = validation.height!
        } else if (isVideo) {
          const validation = await validateVideoDimensions(file)
          if (!validation.valid) {
            throw new Error(validation.error)
          }
          width = validation.width!
          height = validation.height!
          duration = validation.duration!
        } else {
          const validation = await validateImageDimensions(file)
          if (!validation.valid) {
            throw new Error(validation.error)
          }
          width = validation.width!
          height = validation.height!
        }

        setUploadProgress((prev) => ({
          ...prev,
          [progressKey]: { fileName: file.name, progress: 25 },
        }))

        // Step 1: Get presigned upload URL
        const { uploadUrl, fileKey } = await generateUploadUrl.mutateAsync({
          eventId,
          mimeType: file.type,
          fileSize: file.size,
          mediaType,
        })

        setUploadProgress((prev) => ({
          ...prev,
          [progressKey]: { fileName: file.name, progress: 40 },
        }))

        // Step 2: Upload file to R2
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        })

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`)
        }

        setUploadProgress((prev) => ({
          ...prev,
          [progressKey]: { fileName: file.name, progress: 70 },
        }))

        // Step 3: Confirm upload and save metadata
        const mediaRecord = await confirmUpload.mutateAsync({
          eventId,
          fileKey,
          fileSize: file.size,
          mimeType: file.type,
          width,
          height,
          duration,
          mediaType,
        })

        setUploadProgress((prev) => ({
          ...prev,
          [progressKey]: { fileName: file.name, progress: 100 },
        }))

        // Add to uploaded media list
        const newMedia: UploadedMedia = {
          id: mediaRecord.id,
          url: URL.createObjectURL(file), // Temporary preview URL
          type: mediaType,
          fileName: file.name,
          fileSize: file.size,
        }

        setUploadedMedia((prev) => [...prev, newMedia])

        // Remove progress after a delay
        setTimeout(() => {
          setUploadProgress((prev) => {
            const { [progressKey]: _, ...rest } = prev
            return rest
          })
        }, 2000)

        const typeLabel = isPDF ? "PDF" : isPoster ? "Poster" : isVideo ? "Video" : "Image"
        toast.success(`${typeLabel} uploaded successfully`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed"
        setUploadProgress((prev) => ({
          ...prev,
          [progressKey]: { fileName: file.name, progress: 0, error: errorMessage },
        }))
        toast.error(errorMessage)

        // Remove error after delay
        setTimeout(() => {
          setUploadProgress((prev) => {
            const { [progressKey]: _, ...rest } = prev
            return rest
          })
        }, 5000)
      }
    },
    [eventId, generateUploadUrl, confirmUpload, setUploadedMedia],
  )

  const onDropImages = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > 10) {
        toast.error("Maximum 10 images allowed")
        return
      }

      setUploading(true)
      for (const file of acceptedFiles) {
        await handleUploadFile(file, "image")
      }
      setUploading(false)
    },
    [images.length, handleUploadFile],
  )

  const onDropVideo = useCallback(
    async (acceptedFiles: File[]) => {
      if (video) {
        toast.error("Only one video allowed. Please delete the existing video first.")
        return
      }

      if (acceptedFiles.length > 1) {
        toast.error("Only one video allowed")
        return
      }

      setUploading(true)
      await handleUploadFile(acceptedFiles[0], "video")
      setUploading(false)
    },
    [video, handleUploadFile],
  )

  const onDropPoster = useCallback(
    async (acceptedFiles: File[]) => {
      if (poster) {
        toast.error("Only one poster allowed. Please delete the existing poster first.")
        return
      }

      if (acceptedFiles.length > 1) {
        toast.error("Only one poster allowed")
        return
      }

      setUploading(true)
      await handleUploadFile(acceptedFiles[0], "poster")
      setUploading(false)
    },
    [poster, handleUploadFile],
  )

  const onDropPDFs = useCallback(
    async (acceptedFiles: File[]) => {
      if (pdfs.length + acceptedFiles.length > 5) {
        toast.error("Maximum 5 PDFs allowed")
        return
      }

      setUploading(true)
      for (const file of acceptedFiles) {
        await handleUploadFile(file, "pdf")
      }
      setUploading(false)
    },
    [pdfs.length, handleUploadFile],
  )

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({
    onDrop: onDropImages,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    maxFiles: 10,
    disabled: uploading || images.length >= 10,
  })

  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
    isDragActive: isVideoDragActive,
  } = useDropzone({
    onDrop: onDropVideo,
    accept: {
      "video/mp4": [".mp4"],
      "video/quicktime": [".mov"],
      "video/webm": [".webm"],
    },
    maxFiles: 1,
    disabled: uploading || !!video,
  })

  const {
    getRootProps: getPosterRootProps,
    getInputProps: getPosterInputProps,
    isDragActive: isPosterDragActive,
  } = useDropzone({
    onDrop: onDropPoster,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    disabled: uploading || !!poster,
  })

  const {
    getRootProps: getPDFRootProps,
    getInputProps: getPDFInputProps,
    isDragActive: isPDFDragActive,
  } = useDropzone({
    onDrop: onDropPDFs,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 5,
    disabled: uploading || pdfs.length >= 5,
  })

  const handleDelete = async (mediaId: string) => {
    try {
      await deleteMedia.mutateAsync({ mediaId })
      setUploadedMedia((prev) => prev.filter((m) => m.id !== mediaId))
      toast.success("Media deleted successfully")
    } catch (error) {
      toast.error("Failed to delete media")
    }
  }

  return (
    <div className="space-y-6">
      {/* Images Section */}
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
          <CardDescription>
            Upload up to 10 photos. Each photo must be between 250px and 8,000px on both dimensions,
            and at most 20MB in size.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Dropzone */}
          <div
            {...getImageRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isImageDragActive
                ? "border-primary bg-primary/5"
                : images.length >= 10
                  ? "border-muted bg-muted/20 cursor-not-allowed"
                  : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getImageInputProps()} />
            <ImageIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            {images.length >= 10 ? (
              <p className="text-muted-foreground text-sm">Maximum images reached (10/10)</p>
            ) : (
              <>
                <p className="mb-1 text-sm font-medium">
                  {isImageDragActive
                    ? "Drop images here"
                    : "Drag & drop images here, or click to select"}
                </p>
                <p className="text-muted-foreground text-xs">
                  JPEG, PNG, WebP, GIF (max 20MB each, {images.length}/10 uploaded)
                </p>
              </>
            )}
          </div>

          {/* Upload Progress */}
          {Object.entries(uploadProgress).map(([key, progress]) => {
            const isImage = !progress.fileName.match(/\.(mp4|mov|webm)$/i)
            if (!isImage) return null

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex-1 truncate">{progress.fileName}</span>
                  {progress.error ? (
                    <span className="text-destructive text-xs">{progress.error}</span>
                  ) : (
                    <span className="text-muted-foreground">{progress.progress}%</span>
                  )}
                </div>
                <Progress
                  value={progress.progress}
                  className={progress.error ? "bg-destructive/20" : ""}
                />
              </div>
            )
          })}

          {/* Uploaded Images Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {images.map((media) => (
                <div
                  key={media.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border"
                >
                  <img
                    src={media.url}
                    alt={media.fileName}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(media.id)}
                      disabled={deleteMedia.isPending}
                    >
                      {deleteMedia.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="absolute right-0 bottom-0 left-0 truncate bg-black/70 p-2 text-xs text-white">
                    {media.fileName} ({formatFileSize(media.fileSize)})
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Section */}
      <Card>
        <CardHeader>
          <CardTitle>Video</CardTitle>
          <CardDescription>
            Upload one video (optional). Video must be between 2 seconds and 2 minutes long, between
            250px and 8,000px on both dimensions, and at most 100MB in size.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!video ? (
            <>
              {/* Video Dropzone */}
              <div
                {...getVideoRootProps()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isVideoDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getVideoInputProps()} />
                <VideoIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="mb-1 text-sm font-medium">
                  {isVideoDragActive
                    ? "Drop video here"
                    : "Drag & drop a video here, or click to select"}
                </p>
                <p className="text-muted-foreground text-xs">
                  MP4, MOV, WebM (max 100MB, 2s-2min duration)
                </p>
              </div>

              {/* Video Upload Progress */}
              {Object.entries(uploadProgress).map(([key, progress]) => {
                const isVideo = progress.fileName.match(/\.(mp4|mov|webm)$/i)
                if (!isVideo) return null

                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex-1 truncate">{progress.fileName}</span>
                      {progress.error ? (
                        <span className="text-destructive text-xs">{progress.error}</span>
                      ) : (
                        <span className="text-muted-foreground">{progress.progress}%</span>
                      )}
                    </div>
                    <Progress
                      value={progress.progress}
                      className={progress.error ? "bg-destructive/20" : ""}
                    />
                  </div>
                )
              })}
            </>
          ) : (
            /* Uploaded Video */
            <div className="relative overflow-hidden rounded-lg border">
              <video src={video.url} controls className="w-full" />
              <div className="bg-muted flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{video.fileName}</p>
                  <p className="text-muted-foreground text-xs">{formatFileSize(video.fileSize)}</p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(video.id)}
                  disabled={deleteMedia.isPending}
                >
                  {deleteMedia.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Poster/Flyer Section */}
      <Card>
        <CardHeader>
          <CardTitle>Event Poster/Flyer</CardTitle>
          <CardDescription>
            Upload one event poster or flyer (optional). Must be between 500px and 12,000px on both dimensions,
            with aspect ratio 11:17, 4:5, 9:16, or 8.5:11, and at most 20MB in size.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!poster ? (
            <>
              {/* Poster Dropzone */}
              <div
                {...getPosterRootProps()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isPosterDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getPosterInputProps()} />
                <FileImage className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="mb-1 text-sm font-medium">
                  {isPosterDragActive
                    ? "Drop poster here"
                    : "Drag & drop a poster here, or click to select"}
                </p>
                <p className="text-muted-foreground text-xs">
                  JPEG, PNG, WebP (max 20MB, aspect ratios: 11:17, 4:5, 9:16, 8.5:11)
                </p>
              </div>

              {/* Poster Upload Progress */}
              {Object.entries(uploadProgress).map(([key, progress]) => {
                if (!poster && progress.fileName.match(/poster/i)) {
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex-1 truncate">{progress.fileName}</span>
                        {progress.error ? (
                          <span className="text-destructive text-xs">{progress.error}</span>
                        ) : (
                          <span className="text-muted-foreground">{progress.progress}%</span>
                        )}
                      </div>
                      <Progress
                        value={progress.progress}
                        className={progress.error ? "bg-destructive/20" : ""}
                      />
                    </div>
                  )
                }
                return null
              })}
            </>
          ) : (
            /* Uploaded Poster */
            <div className="relative overflow-hidden rounded-lg border">
              <img src={poster.url} alt={poster.fileName} className="mx-auto max-h-96 object-contain" />
              <div className="bg-muted flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{poster.fileName}</p>
                  <p className="text-muted-foreground text-xs">{formatFileSize(poster.fileSize)}</p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(poster.id)}
                  disabled={deleteMedia.isPending}
                >
                  {deleteMedia.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDFs Section */}
      <Card>
        <CardHeader>
          <CardTitle>PDF Documents</CardTitle>
          <CardDescription>
            Upload up to 5 PDF documents (optional). These can be event schedules, brochures, programs, or other materials.
            Each PDF must be at most 10MB in size.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* PDF Dropzone */}
          <div
            {...getPDFRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isPDFDragActive
                ? "border-primary bg-primary/5"
                : pdfs.length >= 5
                  ? "border-muted bg-muted/20 cursor-not-allowed"
                  : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getPDFInputProps()} />
            <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            {pdfs.length >= 5 ? (
              <p className="text-muted-foreground text-sm">Maximum PDFs reached (5/5)</p>
            ) : (
              <>
                <p className="mb-1 text-sm font-medium">
                  {isPDFDragActive
                    ? "Drop PDFs here"
                    : "Drag & drop PDFs here, or click to select"}
                </p>
                <p className="text-muted-foreground text-xs">
                  PDF documents (max 10MB each, {pdfs.length}/5 uploaded)
                </p>
              </>
            )}
          </div>

          {/* PDF Upload Progress */}
          {Object.entries(uploadProgress).map(([key, progress]) => {
            const isPDF = progress.fileName.match(/\.pdf$/i)
            if (!isPDF) return null

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex-1 truncate">{progress.fileName}</span>
                  {progress.error ? (
                    <span className="text-destructive text-xs">{progress.error}</span>
                  ) : (
                    <span className="text-muted-foreground">{progress.progress}%</span>
                  )}
                </div>
                <Progress
                  value={progress.progress}
                  className={progress.error ? "bg-destructive/20" : ""}
                />
              </div>
            )
          })}

          {/* Uploaded PDFs List */}
          {pdfs.length > 0 && (
            <div className="space-y-2">
              {pdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="bg-muted flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="text-muted-foreground h-8 w-8" />
                    <div>
                      <p className="text-sm font-medium">{pdf.fileName}</p>
                      <p className="text-muted-foreground text-xs">{formatFileSize(pdf.fileSize)}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(pdf.id)}
                    disabled={deleteMedia.isPending}
                  >
                    {deleteMedia.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
