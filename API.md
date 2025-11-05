# Go Sandy APK Hub - API Documentation

This document describes all available API endpoints for the Go Sandy APK Hub application.

## Overview

The API uses tRPC (TypeScript RPC) for type-safe client-server communication. All endpoints are accessible via the `/api/trpc` route.

## Authentication

The API uses Manus OAuth for authentication. Users must be logged in to access protected endpoints.

### User Roles
- **user**: Regular user (default role)
- **admin**: Administrator with full access to management endpoints

## API Endpoints

### Authentication Endpoints

#### `auth.me`
Get the current authenticated user's information.

**Type**: Public Procedure (Query)

**Response**:
```typescript
{
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}
```

**Example**:
```typescript
const user = await trpc.auth.me.useQuery();
```

---

#### `auth.logout`
Log out the current user and clear the session cookie.

**Type**: Public Procedure (Mutation)

**Response**:
```typescript
{
  success: true;
}
```

**Example**:
```typescript
const { mutate } = trpc.auth.logout.useMutation();
mutate();
```

---

### APK Endpoints

#### `apk.list`
Get all available APKs.

**Type**: Public Procedure (Query)

**Response**:
```typescript
Array<{
  id: number;
  name: string;
  description: string | null;
  version: string;
  categoryId: number | null;
  fileUrl: string;
  fileKey: string;
  fileSize: number | null;
  photoUrl: string | null;
  photoKey: string | null;
  downloadCount: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}>
```

**Example**:
```typescript
const { data: apks } = trpc.apk.list.useQuery();
```

---

#### `apk.getById`
Get detailed information about a specific APK.

**Type**: Public Procedure (Query)

**Input**:
```typescript
{
  id: number;
}
```

**Response**:
```typescript
{
  id: number;
  name: string;
  description: string | null;
  version: string;
  categoryId: number | null;
  fileUrl: string;
  fileKey: string;
  fileSize: number | null;
  photoUrl: string | null;
  photoKey: string | null;
  downloadCount: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Example**:
```typescript
const { data: apk } = trpc.apk.getById.useQuery({ id: 1 });
```

---

#### `apk.create`
Create a new APK entry. **Requires admin role**.

**Type**: Protected Procedure (Mutation)

**Input**:
```typescript
{
  name: string;              // Required, minimum 1 character
  description?: string;      // Optional
  version: string;           // Required, minimum 1 character
  categoryId?: number;       // Optional
  fileKey: string;           // Required, S3 key for APK file
  fileUrl: string;           // Required, S3 URL for APK file
  fileSize?: number;         // Optional, file size in bytes
  photoKey?: string;         // Optional, S3 key for thumbnail
  photoUrl?: string;         // Optional, S3 URL for thumbnail
}
```

**Response**:
```typescript
{
  insertId: number;
}
```

**Example**:
```typescript
const { mutate } = trpc.apk.create.useMutation();
mutate({
  name: "Go Sandy v1.0",
  version: "1.0.0",
  description: "The latest version of Go Sandy",
  fileUrl: "https://s3.example.com/apks/go-sandy-1.0.apk",
  fileKey: "apks/go-sandy-1.0.apk",
  photoUrl: "https://s3.example.com/photos/go-sandy-1.0.png",
  photoKey: "photos/go-sandy-1.0.png",
});
```

---

#### `apk.update`
Update an existing APK. **Requires admin role**.

**Type**: Protected Procedure (Mutation)

**Input**:
```typescript
{
  id: number;                // Required, APK ID
  name?: string;             // Optional
  description?: string;      // Optional
  version?: string;          // Optional
  categoryId?: number;       // Optional
  photoKey?: string;         // Optional
  photoUrl?: string;         // Optional
}
```

**Response**:
```typescript
{
  rowsAffected: number;
}
```

**Example**:
```typescript
const { mutate } = trpc.apk.update.useMutation();
mutate({
  id: 1,
  description: "Updated description",
  version: "1.0.1",
});
```

---

#### `apk.delete`
Delete an APK. **Requires admin role**.

**Type**: Protected Procedure (Mutation)

**Input**:
```typescript
{
  id: number;  // Required, APK ID to delete
}
```

**Response**:
```typescript
{
  rowsAffected: number;
}
```

**Example**:
```typescript
const { mutate } = trpc.apk.delete.useMutation();
mutate({ id: 1 });
```

---

#### `apk.download`
Increment download count and get a presigned download URL.

**Type**: Public Procedure (Mutation)

**Input**:
```typescript
{
  id: number;  // Required, APK ID
}
```

**Response**:
```typescript
{
  url: string;  // Presigned S3 URL for downloading the file
  key: string;  // S3 key of the file
}
```

**Example**:
```typescript
const { mutate } = trpc.apk.download.useMutation();
const result = await mutate({ id: 1 });
window.location.href = result.url;  // Trigger download
```

---

### Category Endpoints

#### `category.list`
Get all APK categories.

**Type**: Public Procedure (Query)

**Response**:
```typescript
Array<{
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
}>
```

**Example**:
```typescript
const { data: categories } = trpc.category.list.useQuery();
```

---

#### `category.create`
Create a new APK category. **Requires admin role**.

**Type**: Protected Procedure (Mutation)

**Input**:
```typescript
{
  name: string;         // Required, minimum 1 character
  description?: string; // Optional
}
```

**Response**:
```typescript
{
  insertId: number;
}
```

**Example**:
```typescript
const { mutate } = trpc.category.create.useMutation();
mutate({
  name: "Games",
  description: "Gaming applications",
});
```

---

## Error Handling

The API returns standard tRPC error responses. Common error codes include:

| Code | Meaning |
|------|---------|
| `UNAUTHORIZED` | User is not authenticated |
| `FORBIDDEN` | User lacks required permissions (e.g., admin role) |
| `NOT_FOUND` | Requested resource does not exist |
| `BAD_REQUEST` | Invalid input parameters |
| `INTERNAL_SERVER_ERROR` | Server error |

**Error Response Example**:
```typescript
{
  code: "FORBIDDEN",
  message: "User must be admin to perform this action"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production deployments, consider adding rate limiting middleware.

---

## Pagination

The current API does not implement pagination. For applications with large APK collections, consider implementing cursor-based or offset pagination.

---

## Caching

tRPC automatically caches query results. To invalidate cache after mutations:

```typescript
const utils = trpc.useUtils();
await mutate();
await utils.apk.list.invalidate();
```

---

## File Upload

Files are uploaded directly to S3 before creating APK entries:

1. Upload APK file to S3
2. Get the S3 URL and key
3. Call `apk.create` with the S3 URLs

Example:
```typescript
// Upload file to S3
const { url: fileUrl, key: fileKey } = await uploadToS3(apkFile);
const { url: photoUrl, key: photoKey } = await uploadToS3(photoFile);

// Create APK entry
const { mutate } = trpc.apk.create.useMutation();
mutate({
  name: "My App",
  version: "1.0.0",
  fileUrl,
  fileKey,
  photoUrl,
  photoKey,
});
```

---

## Examples

### Fetch and Display APKs

```typescript
import { trpc } from '@/lib/trpc';

function APKList() {
  const { data: apks, isLoading } = trpc.apk.list.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {apks?.map(apk => (
        <div key={apk.id}>
          <h3>{apk.name}</h3>
          <p>Version: {apk.version}</p>
          <p>{apk.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Create APK (Admin)

```typescript
import { trpc } from '@/lib/trpc';
import { useState } from 'react';

function CreateAPK() {
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    fileUrl: '',
    fileKey: '',
  });

  const { mutate } = trpc.apk.create.useMutation({
    onSuccess: () => {
      alert('APK created successfully!');
      setFormData({ name: '', version: '', fileUrl: '', fileKey: '' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="APK Name"
      />
      <input
        value={formData.version}
        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
        placeholder="Version"
      />
      <input
        value={formData.fileUrl}
        onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
        placeholder="File URL"
      />
      <button type="submit">Create APK</button>
    </form>
  );
}
```

### Download APK

```typescript
import { trpc } from '@/lib/trpc';

function DownloadButton({ apkId, apkName }) {
  const { mutate, isPending } = trpc.apk.download.useMutation({
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  return (
    <button
      onClick={() => mutate({ id: apkId })}
      disabled={isPending}
    >
      {isPending ? 'Downloading...' : 'Download'}
    </button>
  );
}
```

---

## Best Practices

1. **Always check user role** before allowing admin operations
2. **Validate file sizes** before uploading to S3
3. **Use presigned URLs** for secure file access
4. **Implement error handling** for all API calls
5. **Cache results** to reduce database queries
6. **Invalidate cache** after mutations
7. **Use TypeScript** for type safety

---

## Support

For API issues or questions, please refer to the README.md or contact the project maintainer.
