import { Ctx, NotFoundError } from "blitz"
import db, { Prisma, User, Wishlist } from "db"
import { z } from "zod"

export type CensoredUser = Pick<User, "name" | "id" | "role">
export type WithCensoredUser<T> = T & { wisher: CensoredUser }
export type MaybeWithWisher<T> = T & { wisher?: User | CensoredUser }

const GetWishlistInput = z.object({
  id: z.number(),
})

export default async function GetWishlistWithWisher(input, ctx: Ctx) {
  ctx.session.$isAuthorized()

  const validated = GetWishlistInput.parse(input)
  const include: Prisma.WishlistInclude = { wisher: true }
  const query: Prisma.WishlistFindFirstArgs = { include, where: validated }
  const wishlist: MaybeWithWisher<Wishlist> | null = await db.wishlist.findFirst(query)

  if (!wishlist) throw new NotFoundError("wishlist not found")
  const uncensored = wishlist.wisher
  if (!uncensored) throw new NotFoundError("wisher not found")

  const { name, id, role } = uncensored
  const censoredUser: CensoredUser = { name, id, role }
  const censoredWishlist: WithCensoredUser<Wishlist> = { ...wishlist, wisher: censoredUser }

  return censoredWishlist
}
