-- DropForeignKey
ALTER TABLE "WishlistItem" DROP CONSTRAINT "WishlistItem_userIdPurchaser_fkey";

-- AlterTable
ALTER TABLE "Wishlist" ADD COLUMN     "notes" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "WishlistItem" ALTER COLUMN "userIdPurchaser" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_userIdPurchaser_fkey" FOREIGN KEY ("userIdPurchaser") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
