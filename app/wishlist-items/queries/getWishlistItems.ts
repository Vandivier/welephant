import { paginate, Ctx } from "blitz"
import db from "db"
import { Prisma } from "@prisma/client"

interface GetWishlistItemsInput
  extends Pick<Prisma.WishlistItemFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default async function Get__ModelNames(input: GetWishlistItemsInput, ctx: Ctx) {
  ctx.session.$isAuthorized()

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const {
    items: wishlistItems,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip: input.skip,
    take: input.take,
    count: () => db.wishlistItem.count({ where: input.where }),
    query: (paginateArgs) =>
      db.wishlistItem.findMany({
        ...paginateArgs,
        where: input.where,
        orderBy: input.orderBy,
      }),
  })

  return {
    wishlistItems,
    nextPage,
    hasMore,
    count,
  }
}
