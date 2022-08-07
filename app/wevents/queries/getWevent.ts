import { Ctx, NotFoundError } from "blitz";
import db from "db";
import { z } from "zod";

const GetWeventInput = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default async function GetWevent(input, ctx: Ctx) {
  GetWeventInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wevent = await db.wevent.findFirst({ where: { id: input.id } });

  if (!wevent) throw new NotFoundError();

  return wevent;
}
