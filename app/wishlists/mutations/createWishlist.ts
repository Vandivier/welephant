import { Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const CreateWishlistInput = z.object({
  name: z.string(),
})

export default async function CreateWishlist(input, ctx: Ctx) {
  CreateWishlistInput.parse(input)
  ctx.session.$isAuthorized()

  const userIdWisher = ctx.session.userId

  if (userIdWisher === null) {
    throw new Error("Logged in user not found! Cannot create Wishlist.")
  }

  const wishlist = await db.wishlist.create({
    data: {
      name: input.name,
      userIdWisher,
    },
  })

  return wishlist
}
