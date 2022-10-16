import { Ctx } from "blitz"
import db, { Prisma } from "db"
import { z } from "zod"

const CreateWishlistItemInput = z.object({
  name: z.string(),
  // TODO: don't pass userIdPurchaser
  userIdPurchaser: z.number(),
  userIdWisher: z.number(),
  wishlistId: z.number(),
})

export default async function CreateWishlistItem(input, ctx: Ctx) {
  ctx.session.$isAuthorized()

  const loggedInUser = ctx.session.userId
  const validated: Prisma.WishlistItemUncheckedCreateInput = CreateWishlistItemInput.parse({
    ...input,
    userIdPurchaser: loggedInUser,
    userIdWisher: loggedInUser,
  })

  const wishlistItem = await db.wishlistItem.create({ data: validated })
  return wishlistItem
}
