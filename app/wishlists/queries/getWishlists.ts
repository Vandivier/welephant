import { paginate, Ctx } from "blitz";
import db from "db";
import { Prisma } from "@prisma/client";

interface GetWishlistsInput
  extends Pick<
    Prisma.WishlistFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default async function Get__ModelNames(
  input: GetWishlistsInput,
  ctx: Ctx
) {
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const {
    items: wishlists,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip: input.skip,
    take: input.take,
    count: () => db.wishlist.count({ where: input.where }),
    query: (paginateArgs) =>
      db.wishlist.findMany({
        ...paginateArgs,
        where: input.where,
        orderBy: input.orderBy,
      }),
  });

  return {
    wishlists,
    nextPage,
    hasMore,
    count,
  };
}
