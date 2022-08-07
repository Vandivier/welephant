import db from "db";
import { z } from "zod";

const UpdateWeventInput = z.object({
  id: z.number(),
  name: z.string(),
});

export default async function UpdateWevent(input, ctx: Ctx) {
  UpdateWeventInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wevent = await db.wevent.update({ where: { id: input.id }, input });

  return wevent;
}
