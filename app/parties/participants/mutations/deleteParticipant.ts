import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteParticipant = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteParticipant),
  resolver.authorize(),
  async ({ id }) => {
    const participant = await db.participant.deleteMany({ where: { id } })

    return participant
  }
)
