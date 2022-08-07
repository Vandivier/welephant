import { Ctx } from "blitz";
import db from "db";
import { z } from "zod";

const CreateWeventInput = z.object({
  name: z.string(),
});

export default async function CreateWevent(input, ctx: Ctx) {
  CreateWeventInput.parse(input);
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wevent = await db.wevent.create({ data: input });

  return wevent;
}
