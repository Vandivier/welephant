-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "purchasedAt" DATETIME,
    "userIdPurchaser" INTEGER NOT NULL,
    "userIdWisher" INTEGER NOT NULL,
    CONSTRAINT "WishlistItem_userIdPurchaser_fkey" FOREIGN KEY ("userIdPurchaser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WishlistItem_userIdWisher_fkey" FOREIGN KEY ("userIdWisher") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
