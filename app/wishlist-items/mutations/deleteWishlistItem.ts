import { Ctx } from "blitz";
import db from "db";
import { z } from "zod";

const DeleteWishlistItemInput = z.object({
  id: z.number(),
});

export default async function DeleteWishlistItem(input, ctx: Ctx) {
  DeleteWishlistItemInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wishlistItem = await db.wishlistItem.deleteMany({
    where: { id: input.id },
  });

  return wishlistItem;
}
