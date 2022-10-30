import { resolver } from "@blitzjs/rpc"
import db, { ParticipantStatus } from "db"
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
    const { isAttending, ...dataToKeep } = input
    const status: ParticipantStatus = isAttending
      ? ParticipantStatus.ACCEPTED
      : ParticipantStatus.DECLINED
    const massaged = { ...dataToKeep, status }
    const participant = await db.participant.create({ data: massaged })

    return participant
  }
)
