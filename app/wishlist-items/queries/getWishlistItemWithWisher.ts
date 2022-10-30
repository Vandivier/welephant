import {
  CensoredUser,
  MaybeWithWisher,
  WithCensoredUser,
} from "app/wishlists/queries/getWishlistWithWisher"
import { Ctx, NotFoundError } from "blitz"
import db, { Prisma, WishlistItem } from "db"
import { z } from "zod"

const GetWishlistItemInput = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default async function GetWishlistItemWithWisher(input, ctx: Ctx) {
  ctx.session.$isAuthorized()
  const validated = GetWishlistItemInput.parse(input)
  const include: Prisma.WishlistItemInclude = { wisher: true }
  const query: Prisma.WishlistItemFindFirstArgs = { include, where: validated }
  const wishlistItem: MaybeWithWisher<WishlistItem> | null = await db.wishlistItem.findFirst(query)

  if (!wishlistItem) throw new NotFoundError("wishlist not found")
  const uncensored = wishlistItem.wisher
  if (!uncensored) throw new NotFoundError("wisher not found")

  const { name, id, role } = uncensored
  const censoredUser: CensoredUser = { name, id, role }
  const censoredWishlistItem: WithCensoredUser<WishlistItem> = {
    ...wishlistItem,
    wisher: censoredUser,
  }

  return censoredWishlistItem
}
