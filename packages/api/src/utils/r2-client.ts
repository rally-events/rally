import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  type DeleteObjectCommandInput,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

if (
  !process.env.R2_ACCOUNT_ID ||
  !process.env.R2_ACCESS_KEY_ID ||
  !process.env.R2_SECRET_ACCESS_KEY ||
  !process.env.R2_BUCKET_NAME
) {
  throw new Error("Missing required R2 environment variables")
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME

/**
 * Generate a presigned URL for uploading a file to R2
 * @param fileKey - Unique key/path for the file in R2
 * @param contentType - MIME type of the file
 * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Presigned URL for uploading
 */
export async function generatePresignedUploadUrl(
  fileKey: string,
  contentType: string,
  expiresIn: number = 3600,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: contentType,
  })

  // Use browser-compatible client for presigned URLs
  return await getSignedUrl(r2Client, command, { expiresIn })
}

/**
 * Generate a presigned URL for downloading a file from R2
 * @param fileKey - Key/path of the file in R2
 * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Presigned URL for downloading
 */
export async function generatePresignedDownloadUrl(
  fileKey: string,
  expiresIn: number = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  })

  return await getSignedUrl(r2Client, command, { expiresIn })
}

/**
 * Delete a file from R2
 * @param fileKey - Key/path of the file to delete
 */
export async function deleteFile(fileKey: string): Promise<void> {
  const params: DeleteObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
  }

  const command = new DeleteObjectCommand(params)
  await r2Client.send(command)
}

/**
 * Get the public URL for a file (if bucket/file is public)
 * @param fileKey - Key/path of the file in R2
 * @returns Public URL (requires R2_PUBLIC_URL env var)
 */
export function getPublicUrl(fileKey: string): string {
  const publicUrl = process.env.R2_PUBLIC_URL

  if (!publicUrl) {
    throw new Error("R2_PUBLIC_URL environment variable is not set")
  }

  return `${publicUrl}/${fileKey}`
}
