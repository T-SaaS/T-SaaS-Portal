# Signature and Document Architecture

## Overview

This document explains the architecture for handling signatures and document photos in the Driver Qualification Tool.

## Storage Strategy

### Signatures

- **Storage**: `application-signatures` bucket (public URLs)
- **Database**: Only metadata (no base64 data)
- **Purpose**: User consent signatures for background checks, employment, etc.

### Document Photos

- **Storage**: `driver-file-documents` bucket (private, signed URLs only)
- **Database**: Only metadata (no base64 data)
- **Purpose**: License photos, medical card photos

## Data Structures

### API Requests (`SignatureRequestData`)

```typescript
{
  data: string | null;        // Base64 data for upload
  uploaded: boolean;          // Upload status
  url?: string;              // Public URL
  signedUrl?: string;        // Signed URL
  path?: string;             // Storage path
  timestamp?: string;        // Creation timestamp
}
```

### Database Storage (`SignatureData`)

```typescript
{
  uploaded: boolean;          // Upload status
  url?: string;              // Public URL
  signedUrl?: string;        // Signed URL
  path?: string;             // Storage path
  timestamp?: string;        // Creation timestamp
}
```

### Document Photos (`DocumentPhotoData`)

```typescript
{
  uploaded: boolean;          // Upload status
  url?: string;              // Public URL (null for private docs)
  signedUrl?: string;        // Signed URL
  path?: string;             // Storage path
  timestamp?: string;        // Creation timestamp
  filename?: string;         // Original filename
  contentType?: string;      // MIME type
  size?: number;            // File size in bytes
}
```

## API Endpoints

### Signatures

- `POST /api/v1/signatures/upload` - Upload signature to storage
- `PUT /api/v1/driver-applications/:id` - Update signature metadata
- `GET /api/v1/driver-applications/:id/signatures/for-editing` - Get signatures for editing

### Document Photos

- `POST /api/v1/documents/upload` - Upload document to private storage
- `PUT /api/v1/driver-applications/:id` - Update document metadata

## Editing Workflow

### For Signatures

1. **Retrieve for editing**: Call `GET /api/v1/driver-applications/:id/signatures/for-editing`
2. **Get base64 data**: API fetches from storage and returns base64 data URLs
3. **Display in form**: Use base64 data to show existing signatures
4. **Update**: User can modify signatures and re-upload

### For Document Photos

1. **Retrieve metadata**: Get document info from application data
2. **Get signed URL**: Use metadata to generate fresh signed URL
3. **Display**: Show document image using signed URL
4. **Update**: User can replace photos and re-upload

## Benefits

1. **Efficient Storage**: No duplicate data in database
2. **Security**: Documents stored privately with signed URLs
3. **Scalability**: Storage buckets handle large files efficiently
4. **Editability**: Signatures can be retrieved and edited
5. **Type Safety**: Separate types for API requests vs database storage

## Migration Notes

- Existing signature columns already store metadata only
- New document photo columns added via migration
- No data migration needed (data already in storage)

## Security Considerations

- Document photos are private (no public URLs)
- Signed URLs expire after 1 hour
- File size limits enforced (5MB for documents)
- MIME type restrictions applied
