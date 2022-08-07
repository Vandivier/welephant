import { Ctx } from "blitz";
import db from "db";
import { z } from "zod";

const DeleteWeventInput = z.object({
  id: z.number(),
});

export default async function DeleteWevent(input, ctx: Ctx) {
  DeleteWeventInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wevent = await db.wevent.deleteMany({ where: { id: input.id } });

  return wevent;
}
