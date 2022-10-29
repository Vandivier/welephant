import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateParticipant = z.object({
  id: z.number(),
  email: z.string().optional(),
  name: z.string(),
  partyId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateParticipant),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const participant = await db.participant.update({ where: { id }, data })

    return participant
  }
)
