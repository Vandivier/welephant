import { resolver } from "@blitzjs/rpc"
import db, { ParticipantStatus } from "db"
import { z } from "zod"
import { handleParticipantUserAssociation, MassagedParticipant } from "../utils"

const CreateParticipant = z.object({
  isAttending: z.boolean(),
  isGifter: z.boolean(),
  email: z.string().email().optional().or(z.literal("")),
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

    const massaged: MassagedParticipant = { ...dataToKeep, status }
    const participant = await db.participant.create({ data: massaged })
    await handleParticipantUserAssociation(massaged, participant.id)
    return participant
  }
)
