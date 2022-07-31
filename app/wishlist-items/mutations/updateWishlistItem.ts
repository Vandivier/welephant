import db from "db";
import { z } from "zod";

const UpdateWishlistItemInput = z.object({
  id: z.number(),
  name: z.string(),
});

export default async function UpdateWishlistItem(input, ctx: Ctx) {
  UpdateWishlistItemInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wishlistItem = await db.wishlistItem.update({
    where: { id: input.id },
    input,
  });

  return wishlistItem;
}
