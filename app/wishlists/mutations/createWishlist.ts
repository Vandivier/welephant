import { Ctx } from "blitz";
import db from "db";
import { z } from "zod";

const CreateWishlistInput = z.object({
  name: z.string(),
});

export default async function CreateWishlist(input, ctx: Ctx) {
  CreateWishlistInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wishlist = await db.wishlist.create({ data: input });

  return wishlist;
}
