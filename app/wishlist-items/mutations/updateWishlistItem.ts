import { Ctx } from "blitz"
import db from "db"
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

  // TODO: ui form is not passing the zod details
  // this check will currently always fail functional testing
  const validatedInput = UpdateWishlistItemInput.parse(input)

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wishlistItem = await db.wishlistItem.update({
    where: { id: input.id },
    data: validatedInput,
  })

  return wishlistItem
}
