import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateParty = z.object({
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateParty),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const party = await db.party.create({ data: input });

    return party;
  }
);
