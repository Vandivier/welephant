import { Ctx } from "blitz";
import db from "db";
import { z } from "zod";

const CreateWishlistItemInput = z.object({
  name: z.string(),
});

export default async function CreateWishlistItem(input, ctx: Ctx) {
  CreateWishlistItemInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wishlistItem = await db.wishlistItem.create({ data: input });

  return wishlistItem;
}
