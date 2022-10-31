import { resolver } from "@blitzjs/rpc"
import db, { Participant, ParticipantStatus, Prisma, User } from "db"
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

    if (data.isGifter) {
      if (data.email) {
        const userToAssociate = await db.user.findUnique({ where: { email: data.email } })
        let maybeAfterAssociation: Participant | null = null
        const participant = await db.participant.update({ where: { id }, data: massaged })

        if (userToAssociate) {
          maybeAfterAssociation = await db.participant.update({
            where: { id },
            data: { User: { connect: { id: userToAssociate.id } } },
          })
        }

        return maybeAfterAssociation || participant
      } else {
        throw new Error("Email must be provided to register as a gifter.")
      }
    }

    const participant = await db.participant.update({ where: { id }, data: massaged })
    return participant
  }
)
