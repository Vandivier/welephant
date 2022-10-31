import { Participant } from "@prisma/client"
import db from "db"

export type MassagedParticipant = {
  status: "ACCEPTED" | "DECLINED"
  email?: string | undefined
  isGifter: boolean
  name: string
  partyId: number
}

export const handleParticipantUserAssociation = async (
  data: MassagedParticipant,
  participantId
) => {
  if (data.isGifter) {
    if (data.email) {
      const userToAssociate = await db.user.findUnique({ where: { email: data.email } })
      let maybeAfterAssociation: Participant | null = null
      const participant = await db.participant.update({ where: { id: participantId }, data })

      if (userToAssociate) {
        maybeAfterAssociation = await db.participant.update({
          where: { id: participantId },
          data: { User: { connect: { id: userToAssociate.id } } },
        })
      }

      return maybeAfterAssociation || participant
    } else {
      throw new Error("Email must be provided to register as a gifter.")
    }
  }
}
