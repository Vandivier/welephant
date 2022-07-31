import db from "db";
import { z } from "zod";

const UpdateWishlistInput = z.object({
  id: z.number(),
  name: z.string(),
});

export default async function UpdateWishlist(input, ctx: Ctx) {
  UpdateWishlistInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wishlist = await db.wishlist.update({ where: { id: input.id }, input });

  return wishlist;
}
