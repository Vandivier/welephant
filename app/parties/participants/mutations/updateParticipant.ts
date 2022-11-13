import { resolver } from "@blitzjs/rpc"
import db, { ParticipantStatus } from "db"
import { z } from "zod"
import { handleParticipantUserAssociation, MassagedParticipant } from "../utils"

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

    const massaged: MassagedParticipant = { ...dataToKeep, status }
    const participant = await db.participant.create({ data: massaged })
    await handleParticipantUserAssociation(massaged, participant.id)
    return participant
  }
)
