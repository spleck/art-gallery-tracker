-- CreateTable
CREATE TABLE "Art" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "location" TEXT,
    "qrCode" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ShareLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME
);

-- CreateTable
CREATE TABLE "_ArtToShareLink" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ArtToShareLink_A_fkey" FOREIGN KEY ("A") REFERENCES "Art" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ArtToShareLink_B_fkey" FOREIGN KEY ("B") REFERENCES "ShareLink" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Art_qrCode_key" ON "Art"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "ShareLink_slug_key" ON "ShareLink"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ArtToShareLink_AB_unique" ON "_ArtToShareLink"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtToShareLink_B_index" ON "_ArtToShareLink"("B");
