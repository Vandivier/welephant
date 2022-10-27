import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateParty = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateParty),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const party = await db.party.update({ where: { id }, data });

    return party;
  }
);
