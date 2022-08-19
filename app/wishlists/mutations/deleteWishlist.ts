import { Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteWishlistInput = z.object({
  id: z.number(),
})

export default async function DeleteWishlist(input, ctx: Ctx) {
  const validatedInput = DeleteWishlistInput.parse(input)
  ctx.session.$isAuthorized()

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wishlist = await db.wishlist.deleteMany({ where: { id: validatedInput.id } })

  return wishlist
}
