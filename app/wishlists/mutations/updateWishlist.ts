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

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wishlist = await db.wishlist.update({
    where: { id: validatedInput.id },
    data: validatedInput,
  })

  return wishlist
}
