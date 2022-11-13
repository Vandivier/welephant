import { Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateWishlistInput = z.object({
  id: z.number(),
  name: z.string(),
  userIdWisher: z.number(),
})

export default async function UpdateWishlist(input, ctx: Ctx) {
  ctx.session.$isAuthorized()

  const validatedInput = UpdateWishlistInput.parse({
    id: input.id,
    name: input.name,
    userIdWisher: ctx.session.userId,
  })

  const wishlistBeforeUpdate = await db.wishlist.findUnique({ where: { id: validatedInput.id } })

  if (!wishlistBeforeUpdate) throw new Error("Wishlist Not Found")
  if (wishlistBeforeUpdate.userIdWisher !== ctx.session.userId) {
    throw new Error("Permission Error")
  }

  const wishlistAfterUpdate = await db.wishlist.update({
    where: { id: validatedInput.id },
    data: validatedInput,
  })

  return wishlistAfterUpdate
}
