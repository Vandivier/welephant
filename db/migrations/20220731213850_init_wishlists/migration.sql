/*
  Warnings:

  - Added the required column `wishlistId` to the `WishlistItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Wishlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "userIdWisher" INTEGER NOT NULL,
    CONSTRAINT "Wishlist_userIdWisher_fkey" FOREIGN KEY ("userIdWisher") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WishlistItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "purchasedAt" DATETIME,
    "userIdPurchaser" INTEGER NOT NULL,
    "userIdWisher" INTEGER NOT NULL,
    "wishlistId" INTEGER NOT NULL,
    CONSTRAINT "WishlistItem_userIdPurchaser_fkey" FOREIGN KEY ("userIdPurchaser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WishlistItem_userIdWisher_fkey" FOREIGN KEY ("userIdWisher") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WishlistItem" ("createdAt", "description", "id", "name", "purchasedAt", "updatedAt", "url", "userIdPurchaser", "userIdWisher") SELECT "createdAt", "description", "id", "name", "purchasedAt", "updatedAt", "url", "userIdPurchaser", "userIdWisher" FROM "WishlistItem";
DROP TABLE "WishlistItem";
ALTER TABLE "new_WishlistItem" RENAME TO "WishlistItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userIdWisher_key" ON "Wishlist"("userIdWisher");
