# Cloudflare R2 Media Upload Integration

## Overview

This document outlines the implementation of Cloudflare R2 storage for photo and video uploads in the Rally event management platform. The integration uses Cloudflare R2's S3-compatible API with presigned URLs for secure, direct client-to-storage uploads.

## Architecture

### Direct Upload Flow
1. Client requests presigned upload URL from tRPC API
2. API validates permissions and generates presigned URL (expires in 1 hour)
3. Client uploads directly to R2 using presigned URL
4. Client confirms upload completion via tRPC API (stores metadata in database)

### Benefits
- **No backend proxy**: Files upload directly to R2, reducing server load
- **Security**: Presigned URLs are time-limited and scoped to specific files
- **Cost**: R2 has $0 egress fees (vs Supabase's $0.09/GB)
- **React Native compatible**: Same presigned URL approach works on mobile

---

## What Has Been Completed

### 1. Environment Configuration 
Added required environment variables:
```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=rally-media
R2_PUBLIC_URL=https://media.yourdomain.com
```

### 2. Package Dependencies 
Installed in `packages/api`:
- `@aws-sdk/client-s3` - S3 client for R2
- `@aws-sdk/s3-request-presigner` - Presigned URL generation

### 3. Database Schema 
Created `mediaTable` in [packages/db/src/schema/media-schema.ts](../packages/db/src/schema/media-schema.ts):
```typescript
{
  id: uuid (primary key)
  eventId: uuid (foreign key to events)
  organizationId: uuid (foreign key to organizations)
  r2FileKey: text (R2 object path)
  fileSize: integer (bytes)
  mimeType: text (e.g., "image/jpeg")
  uploadedBy: uuid (foreign key to users)
  createdAt: timestamp
}
```

### 4. R2 Client Utility 
Created [packages/api/src/utils/r2-client.ts](../packages/api/src/utils/r2-client.ts):

**Functions:**
- `generatePresignedUploadUrl(fileKey, contentType, expiresIn)` - Creates upload URLs
- `generatePresignedDownloadUrl(fileKey, expiresIn)` - Creates download URLs for private files
- `deleteFile(fileKey)` - Deletes files from R2
- `getPublicUrl(fileKey)` - Returns public URL (if bucket is public)

**Configuration:**
- Endpoint: `https://{ACCOUNT_ID}.r2.cloudflarestorage.com`
- Region: `auto` (R2 requirement)
- Uses standard AWS S3 SDK

### 5. tRPC API Procedures 
Created media router at [packages/api/src/router/media-router.ts](../packages/api/src/router/media-router.ts):

#### `media.generateUploadUrl`
**Purpose:** Generate presigned URL for client-side upload

**Input:**
```typescript
{
  eventId: string (uuid)
  mimeType: string
  fileSize: number
}
```

**Output:**
```typescript
{
  uploadUrl: string (presigned URL)
  fileKey: string (R2 object key)
  expiresIn: number (3600 seconds)
}
```

**Validation:**
- User must be member of event's organization
- File size limits:
  - Images: 10MB max
  - Videos: 100MB max
- Allowed MIME types:
  - Images: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
  - Videos: `video/mp4`, `video/quicktime`, `video/webm`

**File Key Format:**
```
events/{eventId}/{timestamp}-{randomString}.{extension}
```

#### `media.deleteMedia`
**Purpose:** Delete media file and database record

**Input:**
```typescript
{
  mediaId: string (uuid)
}
```

**Output:**
```typescript
{
  success: boolean
}
```

**Validation:**
- User must be member of media's organization
- Deletes from both R2 and database atomically

### 6. Validation Schemas 
Created [packages/schemas/src/media-schemas.ts](../packages/schemas/src/media-schemas.ts):
- `generateUploadUrlSchema` - Validates upload URL requests
- `deleteMediaSchema` - Validates deletion requests

---

## What Still Needs To Be Done

### 1. **Complete tRPC Media Procedures** (3-4 hours)

#### `media.confirmUpload`
After client successfully uploads to R2, call this to save metadata.

**Implementation:**
```typescript
// packages/api/src/media/confirmUpload.ts
export default async function confirmUpload(ctx, input) {
  // Input: { eventId, fileKey, fileSize, mimeType }

  // Validate user has access to event
  // Insert into mediaTable
  // Return media record with ID
}
```

**Schema:**
```typescript
// packages/schemas/src/media-schemas.ts
export const confirmUploadSchema = z.object({
  eventId: z.string().uuid(),
  fileKey: z.string().min(1),
  fileSize: z.number().int().positive(),
  mimeType: z.string().min(1),
})
```

#### `media.getEventMedia`
Fetch all media for an event.

**Implementation:**
```typescript
// packages/api/src/media/getEventMedia.ts
export default async function getEventMedia(ctx, input) {
  // Input: { eventId }

  // Query mediaTable where eventId matches
  // Return array of media records with public/presigned URLs
}
```

#### `media.setAsCover`
Set a media item as the event's cover image.

**Implementation:**
```typescript
// packages/api/src/media/setAsCover.ts
export default async function setAsCover(ctx, input) {
  // Input: { eventId, mediaId }

  // Update eventsTable.coverImageKey = media.r2FileKey
  // (You may need to add coverImageKey column to events table)
}
```

### 2. **Frontend Components** (6-8 hours)

#### Component: `EventMediaUploader`
**Location:** `next/src/components/event-editor/event-media-uploader.tsx`

**Features:**
- Drag & drop zone (use `react-dropzone` or similar)
- File type/size validation before upload
- Upload progress indicator
- Thumbnail previews
- Multiple file uploads

**Implementation Flow:**
```typescript
const handleFileSelect = async (files: File[]) => {
  for (const file of files) {
    // 1. Validate file locally
    if (!isValidFileType(file.type)) {
      toast.error('Invalid file type')
      continue
    }

    // 2. Get presigned URL
    const { uploadUrl, fileKey } = await trpc.media.generateUploadUrl.mutate({
      eventId,
      mimeType: file.type,
      fileSize: file.size,
    })

    // 3. Upload directly to R2
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    // 4. Confirm upload (save to database)
    await trpc.media.confirmUpload.mutate({
      eventId,
      fileKey,
      fileSize: file.size,
      mimeType: file.type,
    })

    toast.success('Upload complete')
  }
}
```

#### Component: `EventMediaGallery`
**Location:** `next/src/components/event-editor/event-media-gallery.tsx`

**Features:**
- Grid display of uploaded media
- Video thumbnail generation (use first frame or poster)
- Delete button with confirmation
- Set as cover image button
- Lightbox for full-size viewing (use `yet-another-react-lightbox`)

**Implementation:**
```typescript
const { data: media } = trpc.media.getEventMedia.useQuery({ eventId })

return (
  <div className="grid grid-cols-3 gap-4">
    {media?.map(item => (
      <MediaCard
        key={item.id}
        media={item}
        onDelete={() => handleDelete(item.id)}
        onSetCover={() => handleSetCover(item.id)}
      />
    ))}
  </div>
)
```

### 3. **Integration with Event Editor** (2 hours)

**File:** [next/src/app/dashboard/event/[id]/edit/page.tsx](../next/src/app/dashboard/event/[id]/edit/page.tsx)

**Tasks:**
- Import `EventMediaUploader` and `EventMediaGallery`
- Add new section in event editor form
- Handle media state (uploaded media IDs)
- Display cover image in event preview

**Example Addition:**
```tsx
// In your event editor form
<div className="space-y-4">
  <h3>Event Photos & Videos</h3>
  <EventMediaUploader eventId={eventId} />
  <EventMediaGallery eventId={eventId} />
</div>
```

### 4. **Database Migration** (30 mins)

If you need to add a cover image reference to events table:

```sql
-- supabase/migrations/0004_add_event_cover_image.sql
ALTER TABLE events
ADD COLUMN cover_image_key TEXT;

-- Optional: Add foreign key if you want referential integrity
-- But note: cover might be deleted while event remains
```

### 5. **Optional Enhancements**

#### Image Optimization
- Add image resizing/optimization before upload
- Use `sharp` or browser-based compression
- Generate thumbnails for gallery view

#### Video Processing
- Extract first frame as thumbnail
- Validate video duration/codec
- Consider transcoding (use Cloudflare Stream or external service)

#### Progress Tracking
- Use `XMLHttpRequest` or `axios` for upload progress
- Show progress bar per file
- Cancel/retry functionality

#### Bulk Operations
- Select multiple files to delete
- Reorder media items
- Download all media as zip

---

## How to Use the Existing Implementation

### From Next.js Frontend

```typescript
import { trpc } from '@/lib/trpc/client'

// Generate upload URL
const uploadMutation = trpc.media.generateUploadUrl.useMutation()
const { uploadUrl, fileKey } = await uploadMutation.mutateAsync({
  eventId: 'event-uuid',
  mimeType: 'image/jpeg',
  fileSize: 2048000, // 2MB in bytes
})

// Upload file to R2
const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' })
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type },
})

// Delete media
const deleteMutation = trpc.media.deleteMedia.useMutation()
await deleteMutation.mutateAsync({
  mediaId: 'media-uuid',
})
```

### From React Native (Future)

```typescript
import { trpc } from '@/lib/trpc'
import * as FileSystem from 'expo-file-system'

// Get upload URL (same as Next.js)
const { uploadUrl, fileKey } = await trpc.media.generateUploadUrl.mutate({
  eventId,
  mimeType: 'image/jpeg',
  fileSize: file.size,
})

// Upload using expo-file-system
await FileSystem.uploadAsync(uploadUrl, file.uri, {
  httpMethod: 'PUT',
  headers: { 'Content-Type': 'image/jpeg' },
})
```

---

## File Organization

```
packages/
   api/src/
      utils/
         r2-client.ts  (R2 SDK wrapper)
      media/
         generateUploadUrl.ts  (presigned URL generation)
         deleteMedia.ts  (delete file + DB record)
         confirmUpload.ts L (TODO: save metadata after upload)
         getEventMedia.ts L (TODO: fetch event media)
         setAsCover.ts L (TODO: set cover image)
      router/
          media-router.ts  (tRPC router)

   schemas/src/
      media-schemas.ts  (Zod validation schemas)

   db/src/schema/
      media-schema.ts  (Drizzle ORM schema)

next/src/
   components/
      event-editor/
         event-media-uploader.tsx L (TODO: upload UI)
         event-media-gallery.tsx L (TODO: display media)
      media/
          media-card.tsx L (TODO: individual media item)
          media-lightbox.tsx L (TODO: full-size viewer)

   app/dashboard/event/[id]/edit/
       page.tsx   (TODO: integrate media components)
```

---

## Testing Checklist

### Backend
- [ ] Can generate upload URL with valid event ID
- [ ] Rejects upload URL for unauthorized user
- [ ] Validates file size limits (10MB images, 100MB videos)
- [ ] Validates MIME types
- [ ] Can delete media (removes from R2 and database)
- [ ] Can confirm upload and save metadata
- [ ] Can fetch all media for an event

### Frontend
- [ ] Can select files via drag-and-drop
- [ ] Can select files via file picker
- [ ] Shows upload progress
- [ ] Validates file types before upload
- [ ] Shows error messages for invalid files
- [ ] Displays uploaded media in gallery
- [ ] Can delete media with confirmation
- [ ] Can set cover image

### Integration
- [ ] Media persists across page refreshes
- [ ] Cover image displays on event card
- [ ] Works with event creation flow
- [ ] Works with event editing flow

---

## Security Considerations

### Implemented 
- Presigned URLs expire after 1 hour
- User authorization checks (must be in organization)
- File size limits enforced
- MIME type whitelist
- Unique file keys prevent collisions

### TODO L
- Rate limiting on upload URL generation (prevent abuse)
- Virus scanning (use Cloudflare's scanning or external service)
- Content moderation (flag inappropriate images)
- Audit logging (track who uploaded/deleted what)

---

## Cost Estimation

### R2 Pricing (as of 2025)
- **Storage:** $0.015/GB/month
- **Class A Operations** (writes): $4.50/million requests
- **Class B Operations** (reads): $0.36/million requests
- **Egress:** $0.00 (FREE!)

### Example Monthly Cost
- 1000 events with 5 photos each (5MB avg) = 25GB
- Storage: 25GB × $0.015 = **$0.38/month**
- Uploads: 5000 uploads × ($4.50/1M) = **$0.02/month**
- **Total: ~$0.40/month** for 5000 images

Compare to Supabase: $0.53 storage + $2.25 egress = **$2.78/month**

---

## Next Steps for Developer

1. **Run Database Migration**
   ```bash
   cd supabase
   # Generate migration for mediaTable if not done
   pnpm drizzle-kit generate
   pnpm supabase db push
   ```

2. **Implement Missing tRPC Procedures**
   - Start with `confirmUpload` (most critical)
   - Then `getEventMedia` (needed for gallery)
   - Finally `setAsCover` (nice-to-have)

3. **Build Frontend Components**
   - Start with basic upload button
   - Add drag-and-drop
   - Build gallery view
   - Add delete/cover functionality

4. **Test Full Flow**
   - Upload image to event
   - View in gallery
   - Set as cover
   - Delete image

5. **Deploy**
   - Ensure R2 environment variables are set in production
   - Configure CORS on R2 bucket for your domains
   - Test with production URLs

---

## References

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [tRPC Documentation](https://trpc.io/docs)
- [Presigned URLs Explained](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)

---

## Contact

For questions about this implementation, refer to:
- Architecture decisions: `notes/tRPC-API-Architecture.md`
- Database schema: `packages/db/src/schema/media-schema.ts`
- API implementation: `packages/api/src/media/`