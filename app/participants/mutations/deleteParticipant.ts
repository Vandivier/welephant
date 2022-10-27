import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteParticipant = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteParticipant),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const participant = await db.participant.deleteMany({ where: { id } });

    return participant;
  }
);
