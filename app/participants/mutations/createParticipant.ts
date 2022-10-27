import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateParticipant = z.object({
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateParticipant),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const participant = await db.participant.create({ data: input });

    return participant;
  }
);
