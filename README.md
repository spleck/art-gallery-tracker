# 🎨 Art Gallery Tracker

A web application to track art at galleries, with QR code discovery and shareable galleries.

## Features

- 📸 **Capture Art**: Take photos and enter details about art you own or discover
- 📱 **QR Code Scanning**: Scan QR codes at galleries to quickly add art to your "interested" list
- 🔗 **Shareable Galleries**: Generate QR codes to share your personal gallery, interested gallery, or both
- 🗄️ **Database**: Track art across different galleries and events over time

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: SQLite (local) / PostgreSQL (production)
- **ORM**: Prisma
- **QR Codes**: qrcode (generation) + html5-qrcode (scanning)
- **Image Upload**: Local filesystem (dev) / Cloudinary or S3 (production)

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── (gallery)/           # Gallery routes
│   ├── [shareId]/       # Public shareable galleries
├── api/                 # API routes
├── art/                 # Art management
├── scan/                # QR code scanner
├── share/               # Generate share links
components/              # Reusable UI components
lib/                     # Utilities, database
prisma/                  # Database schema
public/                  # Static assets
uploads/                 # Image uploads
```

## MVP Roadmap

1. [ ] Database schema (Art, Gallery, Collection)
2. [ ] Add art form with image upload
3. [ ] Basic gallery views (owned, interested)
4. [ ] QR code generation for sharing
5. [ ] QR code scanner for adding art
6. [ ] Public shareable gallery pages

## Database Schema

```prisma
model Art {
  id          String   @id @default(cuid())
  title       String
  artist      String?
  description String?
  imageUrl    String
  location    String?  // Gallery/event name
  qrCode      String?  @unique // For scanning
  status      ArtStatus
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  shareLinks  ShareLink[]
}

enum ArtStatus {
  OWNED
  INTERESTED
}

model ShareLink {
  id        String      @id @default(cuid())
  type      ShareType
  slug      String      @unique
  artItems  Art[]
  createdAt DateTime    @default(now())
  expiresAt DateTime?
}

enum ShareType {
  OWNED
  INTERESTED
  BOTH
}
```

## License

MIT
