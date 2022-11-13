import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z } from "zod"

const UpdateParty = z.object({
  id: z.number(),
  eventDate: z.date().nullable().or(z.string()),
  eventTime: z.string().nullable(),
  hasGiftAssignments: z.boolean(),
  hasGiftStealing: z.boolean(),
  location: z.string(),
  name: z.string(),
  notes: z.string(),
})

// TODO: could move to a util file
export const mergeDateWithHtmlTime = (date: Date, s: string) => {
  if (s.length !== 5 || !s.includes(":")) return date
  const split = s.split(":")
  const hours = parseInt(split[0] || "", 10)
  const minutes = parseInt(split[1] || "", 10)

  if (isNaN(hours) || isNaN(minutes)) return date
  const merged = new Date(date).setHours(hours, minutes)

  return new Date(merged)
}

export default resolver.pipe(
  resolver.zod(UpdateParty),
  resolver.authorize(),
  async ({ id, ...input }, ctx) => {
    ctx.session.$isAuthorized()

    const partyBeforeUpdate = await db.party.findUnique({ where: { id } })

    if (!partyBeforeUpdate) throw new Error("Party Not Found")
    if (partyBeforeUpdate.userId !== ctx.session.userId) {
      throw new Error("Permission Error")
    }

    const { eventTime, ...inputsToKeep } = input
    const data: Prisma.PartyUpdateInput = {
      ...inputsToKeep,
      ...(input.eventDate
        ? { eventDate: mergeDateWithHtmlTime(new Date(input.eventDate), input.eventTime || "") }
        : {}),
    }

    const partyAfterUpdate = await db.party.update({ where: { id }, data })

    return partyAfterUpdate
  }
)
