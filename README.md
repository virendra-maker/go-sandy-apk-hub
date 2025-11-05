# Go Sandy APK Hub

A full-stack web application for managing and distributing APK files. Features an admin panel for uploading and managing APKs with descriptions and photos, and a public user interface for browsing and downloading APKs.

## Features

- **Admin Panel**: Secure admin dashboard for managing APKs
  - Create, edit, and delete APKs
  - Upload APK files and thumbnail photos
  - Organize APKs by categories
  - Track download statistics

- **User Interface**: Public-facing APK browsing and download
  - Browse all available APKs
  - Filter APKs by category
  - View detailed APK information with photos and descriptions
  - One-click downloads with download tracking
  - Responsive design for mobile and desktop

- **Authentication**: Manus OAuth integration
  - Secure user authentication
  - Role-based access control (admin/user)
  - Session management

- **Database**: MySQL/TiDB with Drizzle ORM
  - APK management with metadata
  - Category organization
  - Download statistics tracking
  - User management

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, TypeScript
- **Backend**: Express.js, tRPC, Node.js
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth
- **Storage**: S3 for file uploads
- **Build Tool**: Vite

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx           # Landing page
│   │   │   ├── APKListing.tsx     # APK browsing page
│   │   │   ├── APKDetail.tsx      # APK details page
│   │   │   └── AdminDashboard.tsx # Admin panel
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/          # Utilities and helpers
│   │   └── App.tsx       # Main app component
│   └── public/           # Static assets
├── server/               # Backend Express application
│   ├── routers.ts        # tRPC procedure definitions
│   ├── db.ts             # Database query helpers
│   └── storage.ts        # S3 storage helpers
├── drizzle/              # Database schema and migrations
│   └── schema.ts         # Drizzle schema definitions
└── shared/               # Shared types and constants
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- MySQL database or TiDB connection
- Manus OAuth credentials
- S3 bucket for file storage

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/virendra-maker/go-sandy-apk-hub.git
   cd go-sandy-apk-hub
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root with the following variables:
   ```
   DATABASE_URL=your_mysql_connection_string
   JWT_SECRET=your_jwt_secret
   VITE_APP_ID=your_manus_app_id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
   BUILT_IN_FORGE_API_URL=your_forge_api_url
   BUILT_IN_FORGE_API_KEY=your_forge_api_key
   VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key
   VITE_FRONTEND_FORGE_API_URL=your_frontend_api_url
   VITE_APP_TITLE=Go Sandy APK Hub
   VITE_APP_LOGO=your_logo_url
   ```

4. **Push database schema**
   ```bash
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Usage

### For Users

1. Visit the home page and click "Browse APKs"
2. Browse available APKs or filter by category
3. Click on an APK to view details
4. Click "Download" to download the APK file

### For Admins

1. Log in with your admin account
2. Click "Admin Panel" in the navigation
3. Click "Add APK" to create a new APK entry
4. Fill in the APK details:
   - APK name and version
   - Description
   - Category (optional)
   - APK file URL (S3 link)
   - Thumbnail photo URL (S3 link)
5. Click "Create APK" to save
6. Edit or delete APKs from the dashboard

## Database Schema

### Users Table
- `id`: Primary key
- `openId`: Manus OAuth identifier
- `name`: User name
- `email`: User email
- `role`: 'admin' or 'user'
- `createdAt`, `updatedAt`, `lastSignedIn`: Timestamps

### APKs Table
- `id`: Primary key
- `name`: APK name
- `description`: APK description
- `version`: Version number
- `categoryId`: Category reference
- `fileUrl`: S3 URL to APK file
- `fileKey`: S3 key for APK file
- `fileSize`: File size in bytes
- `photoUrl`: S3 URL to thumbnail
- `photoKey`: S3 key for thumbnail
- `downloadCount`: Download statistics
- `createdBy`: Admin user ID
- `createdAt`, `updatedAt`: Timestamps

### Categories Table
- `id`: Primary key
- `name`: Category name
- `description`: Category description
- `createdAt`: Creation timestamp

## API Endpoints

All API endpoints are tRPC procedures under `/api/trpc`:

### APK Management
- `apk.list` - Get all APKs (public)
- `apk.getById` - Get APK details (public)
- `apk.create` - Create new APK (admin only)
- `apk.update` - Update APK (admin only)
- `apk.delete` - Delete APK (admin only)
- `apk.download` - Increment download count and get presigned URL (public)

### Categories
- `category.list` - Get all categories (public)
- `category.create` - Create new category (admin only)

### Authentication
- `auth.me` - Get current user info (public)
- `auth.logout` - Logout user (public)

## File Upload

Files are uploaded to S3 storage. The application uses presigned URLs for secure file access:

1. Upload APK and photo files to your S3 bucket
2. Get the S3 URLs for the uploaded files
3. Paste the URLs in the admin panel when creating/editing APKs

## Deployment

To deploy this application:

1. **Create a checkpoint** in the Manus UI
2. **Click the Publish button** to deploy to production
3. **Configure custom domain** in Settings > Domains (optional)

The application will be automatically deployed and accessible via the provided URL.

## Security

- **Authentication**: Manus OAuth ensures secure user authentication
- **Authorization**: Role-based access control prevents unauthorized admin access
- **File Storage**: S3 presigned URLs provide secure file access without exposing credentials
- **Database**: Connection strings are stored in environment variables

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database is accessible from your network
- Check database credentials and permissions

### OAuth Issues
- Verify Manus OAuth credentials are correct
- Check `OAUTH_SERVER_URL` and `VITE_OAUTH_PORTAL_URL`
- Clear browser cookies and try logging in again

### File Upload Issues
- Verify S3 bucket is accessible
- Check S3 credentials and permissions
- Ensure file URLs are publicly accessible

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the project maintainer.

## Author

Created by Virendra Maker

## Changelog

### Version 1.0.0 (Initial Release)
- Full-stack APK hub application
- Admin panel for APK management
- Public user interface for browsing and downloading
- Category organization
- Download tracking
- Responsive design
- Manus OAuth integration
