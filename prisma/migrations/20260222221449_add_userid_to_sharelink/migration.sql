/*
  Warnings:

  - Added the required column `userId` to the `ShareLink` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShareLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    CONSTRAINT "ShareLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ShareLink" ("createdAt", "expiresAt", "id", "slug", "type") SELECT "createdAt", "expiresAt", "id", "slug", "type" FROM "ShareLink";
DROP TABLE "ShareLink";
ALTER TABLE "new_ShareLink" RENAME TO "ShareLink";
CREATE UNIQUE INDEX "ShareLink_slug_key" ON "ShareLink"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
