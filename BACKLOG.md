# 🎨 Art Gallery Tracker - Feature Backlog

## Priority 1: Core Improvements (Do First)

### ✅ Item Editing
- [ ] Edit art details (title, artist, description, location)
- [ ] Replace/update image
- [ ] Delete art items
- [ ] Move between owned/interested collections

### ✅ Multi-User Foundation
- [ ] User accounts (simple email/password to start)
- [ ] Each user's art is isolated to their account
- [ ] Database schema: add User model, link Art to User

---

## Priority 2: Social Features

### 🔐 OAuth Login
- [ ] Sign in with Apple
- [ ] Sign in with Google
- [ ] Sign in with X (Twitter)
- [ ] Sign in with Facebook

### 👥 Friends System
- [ ] Send/accept friend requests
- [ ] View friends list
- [ ] Browse friends' galleries (read-only)
- [ ] Privacy settings (public, friends-only, private)

---

## Priority 3: Gallery Experience

### 🏛️ Gallery/Location Management
- [ ] Create named galleries (e.g., "Dallas Art Fair 2025")
- [ ] Group art by location/gallery
- [ ] Gallery view with map of locations

### 🖼️ Art Discovery
- [ ] QR code generation for each art piece (for galleries to display)
- [ ] Better QR scanning UX (preview before save)
- [ ] Auto-fill art details from scanned QR

---

## Priority 4: Polish & Nice-to-Haves

- [ ] Image optimization/compression
- [ ] Drag-and-drop image upload
- [ ] Search/filter art collection
- [ ] Tags/categories for art
- [ ] Dark mode
- [ ] Export collection to PDF

---

## Technical Debt

- [ ] Move from SQLite to PostgreSQL (for multi-user cloud hosting)
- [ ] Proper error handling and validation
- [ ] Image storage (S3/Cloudinary instead of local)
- [ ] Proper Vercel/production deployment

---

## Discussion Notes

**Multi-User Approach Options:**

**Option A: Quick & Simple**
- Simple email/password auth (NextAuth.js with credentials)
- Keep SQLite for now
- Fastest path to working multi-user

**Option B: Social-First**
- Skip email auth, go straight to OAuth (Google/Apple/etc)
- Better UX, no passwords to manage
- Slightly more setup

**Option C: Full Production**
- PostgreSQL database
- All OAuth providers
- Proper hosting (Vercel/Railway/Render)
- More upfront work, but scales

---

*Last updated: 2026-02-07*
