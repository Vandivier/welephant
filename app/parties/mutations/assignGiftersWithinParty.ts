import { resolver } from "@blitzjs/rpc"
import db, { Participant, ParticipantStatus, Party, Prisma } from "db"
import { z } from "zod"

const AssignGiftersWithinParty = z.object({
  id: z.number(),
})

type SuperParty = null | (Party & { participants: Participant[] })

const scramble = <T>(arr: T): T => {
  if (!Array.isArray(arr)) throw new Error("Must call scramble with an array arg")
  const clone = [...arr]
  const scrambled: any[] = []

  while (clone.length) {
    const randomIdx = Math.floor(Math.random() * clone.length)
    const arrRandom = clone.splice(randomIdx, 1)
    scrambled.push(arrRandom[0])
  }

  return scrambled as T
}

export default resolver.pipe(
  resolver.zod(AssignGiftersWithinParty),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const participantsIncludeArgs: Prisma.ParticipantFindManyArgs = {
      where: {
        isGifter: true,
        partyId: id,
        status: ParticipantStatus.ACCEPTED,
        NOT: { email: "" },
      },
    }
    const include: Prisma.PartyInclude = { participants: participantsIncludeArgs }
    const superParty = (await db.party.findUnique({ include, where: { id } })) as SuperParty
    if (!superParty) throw new Error("Party Not Found 😭😭😭")
    const { participants, ...party } = superParty
    if (ctx.session.userId !== party.userId) throw new Error("User operation not authorized")
    const countOfParticipants = participants.length
    if (countOfParticipants < 3)
      throw new Error(
        "Unable to anonymously assign gift pairs with less than three participating gift givers"
      )
    const participantsToAssign = scramble(participants)

    for (let i = 0; i < countOfParticipants; i++) {
      const prevIdx = i === 0 ? countOfParticipants - 1 : i - 1
      const prev = participantsToAssign[prevIdx]
      const curr = participantsToAssign[i]
      const nextIdx = i + 1 === countOfParticipants ? 0 : i + 1
      const next = participantsToAssign[nextIdx]

      if (!curr || !prev || !next) break

      curr.userIdToGift = next.userId
      curr.userIdGiftedBy = prev.userId
      await db.participant.update({ where: { id }, data: curr })
    }

    return party
  }
)
