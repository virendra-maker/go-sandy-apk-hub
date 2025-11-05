# Go Sandy APK Hub - Setup Guide

This guide will help you set up and deploy the Go Sandy APK Hub application.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18 or higher
- npm or pnpm package manager
- A MySQL database or TiDB instance
- A Manus account with OAuth credentials
- An S3 bucket for file storage
- GitHub account (already connected to Manus)

## Step 1: Clone the Repository

```bash
git clone https://github.com/virendra-maker/go-sandy-apk-hub.git
cd go-sandy-apk-hub
```

## Step 2: Install Dependencies

Using pnpm (recommended):
```bash
pnpm install
```

Or using npm:
```bash
npm install
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root directory and add the following variables:

```env
# Database Configuration
DATABASE_URL=mysql://username:password@host:port/database_name

# Authentication
JWT_SECRET=your_random_jwt_secret_key_here
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=Your Name

# API Configuration
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_backend_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key

# Application Configuration
VITE_APP_TITLE=Go Sandy APK Hub
VITE_APP_LOGO=https://your-logo-url.png
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=your_analytics_id
```

### Getting Your Credentials

1. **Manus OAuth Credentials**
   - Log in to your Manus account
   - Go to Settings > Applications
   - Create or select your application
   - Copy the App ID and API keys

2. **Database Connection**
   - For MySQL: `mysql://user:password@localhost:3306/apk_hub`
   - For TiDB: Contact your TiDB provider for connection string

3. **S3 Configuration**
   - The application uses Manus built-in S3 storage
   - No additional S3 setup needed if using Manus

## Step 4: Set Up Database

Push the database schema:

```bash
pnpm db:push
```

This command will:
- Generate migrations from the schema
- Create all necessary tables (users, apks, categories)
- Set up indexes and relationships

## Step 5: Start Development Server

```bash
pnpm dev
```

The application will start on `http://localhost:3000`

## Step 6: Access the Application

### Home Page
- URL: `http://localhost:3000`
- View features and browse APKs

### User Interface
- URL: `http://localhost:3000/apks`
- Browse all available APKs
- Filter by category
- View APK details and download

### Admin Panel
- URL: `http://localhost:3000/admin`
- Requires admin login
- Manage APKs (create, edit, delete)
- Upload APK files and photos
- Manage categories

## Step 7: Create Admin User

To create an admin user:

1. Log in with your account
2. Access the database directly or use the Manus UI
3. Update your user role to 'admin':
   ```sql
   UPDATE users SET role = 'admin' WHERE openId = 'your_open_id';
   ```

## Step 8: Upload APKs

1. Log in as admin
2. Go to Admin Panel
3. Click "Add APK"
4. Fill in the details:
   - APK Name (e.g., "Go Sandy v1.0")
   - Version (e.g., "1.0.0")
   - Description
   - Category (optional)
   - APK File URL (S3 link)
   - Photo URL (S3 link for thumbnail)
5. Click "Create APK"

## Deployment

### Deploy to Manus

1. **Create a Checkpoint**
   - In the Manus UI, click "Save Checkpoint"
   - Add a description of your changes

2. **Publish**
   - Click the "Publish" button in the UI
   - The application will be deployed automatically

3. **Custom Domain** (Optional)
   - Go to Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed

### Deploy to Other Platforms

The application can also be deployed to:
- Vercel
- Netlify
- Railway
- Heroku
- Docker containers

For deployment to other platforms, ensure:
- All environment variables are set
- Database is accessible from the deployment server
- S3/storage credentials are configured
- Build command: `pnpm build`
- Start command: `pnpm start`

## File Upload Guide

### Uploading APK Files

1. **Prepare your APK file**
   - Ensure the APK is built and ready
   - Note the file size

2. **Upload to S3**
   - Use Manus file storage or your S3 bucket
   - Get the public URL of the uploaded file

3. **Add to Admin Panel**
   - Paste the S3 URL in the "APK File URL" field
   - Paste the S3 key in the "File Key" field

### Uploading Thumbnail Photos

1. **Prepare your image**
   - Recommended size: 300x300px or larger
   - Format: PNG or JPG

2. **Upload to S3**
   - Upload the image file
   - Get the public URL

3. **Add to Admin Panel**
   - Paste the S3 URL in the "Photo URL" field
   - Paste the S3 key in the "Photo Key" field

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
- Check DATABASE_URL is correct
- Verify database server is running
- Check firewall/network access

### OAuth Login Not Working
```
Error: Invalid OAuth credentials
```
- Verify VITE_APP_ID is correct
- Check OAUTH_SERVER_URL is accessible
- Clear browser cookies and try again

### File Upload Fails
```
Error: S3 access denied
```
- Verify S3 credentials in environment
- Check S3 bucket permissions
- Ensure file URLs are publicly accessible

### Build Errors
```
Error: TypeScript compilation failed
```
- Run `pnpm install` to ensure all dependencies are installed
- Check for syntax errors in modified files
- Run `pnpm build` to see full error messages

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run database migrations
pnpm db:push

# Generate database migrations
pnpm db:generate

# Type check
pnpm type-check

# Lint code
pnpm lint
```

## Project Structure

```
go-sandy-apk-hub/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── lib/          # Utilities
│   │   └── App.tsx       # Main app
│   └── public/           # Static files
├── server/               # Backend application
│   ├── routers.ts        # API routes
│   ├── db.ts             # Database queries
│   └── storage.ts        # File storage
├── drizzle/              # Database
│   └── schema.ts         # Database schema
├── shared/               # Shared code
├── README.md             # Project documentation
├── SETUP.md              # This file
└── package.json          # Dependencies
```

## Next Steps

1. **Customize Branding**
   - Update `VITE_APP_TITLE` and `VITE_APP_LOGO`
   - Modify colors in `client/src/index.css`

2. **Add More Categories**
   - Use Admin Panel to create categories
   - Organize APKs by category

3. **Configure Analytics**
   - Set up `VITE_ANALYTICS_WEBSITE_ID`
   - Track downloads and user behavior

4. **Set Up Monitoring**
   - Monitor database performance
   - Track API response times
   - Monitor file storage usage

## Support

For issues or questions:
1. Check the README.md for general information
2. Review error messages in the console
3. Check GitHub Issues for similar problems
4. Contact the project maintainer

## License

This project is licensed under the MIT License.
