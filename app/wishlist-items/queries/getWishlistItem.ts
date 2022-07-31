import { Ctx, NotFoundError } from "blitz";
import db from "db";
import { z } from "zod";

const GetWishlistItemInput = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default async function GetWishlistItem(input, ctx: Ctx) {
  GetWishlistItemInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wishlistItem = await db.wishlistItem.findFirst({
    where: { id: input.id },
  });

  if (!wishlistItem) throw new NotFoundError();

  return wishlistItem;
}
