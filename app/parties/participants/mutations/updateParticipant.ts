import { resolver } from "@blitzjs/rpc"
import db, { ParticipantStatus, Prisma } from "db"
import { z } from "zod"

const UpdateParticipant = z.object({
  id: z.number(),
  isAttending: z.boolean(),
  isGifter: z.boolean(),
  email: z.string().email().optional().or(z.literal("")),
  name: z.string(),
  partyId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateParticipant),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const { isAttending, ...dataToKeep } = data
    const status: ParticipantStatus = isAttending
      ? ParticipantStatus.ACCEPTED
      : ParticipantStatus.DECLINED
    const massaged = { ...dataToKeep, status }

    if (data.isGifter && !data.email)
      throw new Error("Email must be provided to register as a gifter.")

    const participant = await db.participant.update({ where: { id }, data: massaged })

    return participant
  }
)
