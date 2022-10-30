import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateParticipant = z.object({
  isAttending: z.boolean(),
  isGifter: z.boolean(),
  email: z.string().optional(),
  name: z.string(),
  partyId: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateParticipant),
  resolver.authorize(),
  async (input) => {
    const participant = await db.participant.create({ data: input })

    return participant
  }
)
