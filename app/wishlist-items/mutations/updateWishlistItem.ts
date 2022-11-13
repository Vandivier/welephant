import { Ctx } from "blitz"
import db, { WishlistItem } from "db"
import { z } from "zod"

const UpdateWishlistItemInput = z.object({
  id: z.number(),
  name: z.string(),
  userIdPurchaser: z.number(),
  userIdWisher: z.number(),
  wishlistId: z.number(),
})

export default async function UpdateWishlistItem(input, ctx: Ctx) {
  ctx.session.$isAuthorized()

  const validatedInput = UpdateWishlistItemInput.parse(input)

  const wishlistItemBeforeUpdate: WishlistItem | null = await db.wishlistItem.findUnique({
    where: { id: input.id },
  })

  if (!wishlistItemBeforeUpdate) throw new Error("Wishlist Item Not Found")
  if (wishlistItemBeforeUpdate.userIdWisher !== ctx.session.userId) {
    throw new Error("Permission Error")
  }

  const wishlistItemAfterUpdate = await db.wishlistItem.update({
    where: { id: input.id },
    data: validatedInput,
  })

  return wishlistItemAfterUpdate
}
