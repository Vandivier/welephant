import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateParticipant = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateParticipant),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const participant = await db.participant.update({ where: { id }, data });

    return participant;
  }
);
