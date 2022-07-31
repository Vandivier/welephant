import { Ctx, NotFoundError } from "blitz";
import db from "db";
import { z } from "zod";

const GetWishlistInput = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default async function GetWishlist(input, ctx: Ctx) {
  GetWishlistInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wishlist = await db.wishlist.findFirst({ where: { id: input.id } });

  if (!wishlist) throw new NotFoundError();

  return wishlist;
}
