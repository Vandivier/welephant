import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z } from "zod"
import { mergeDateWithHtmlTime } from "./updateParty"

const CreateParty = z.object({
  eventDate: z.date().nullable().or(z.string()),
  eventTime: z.string().nullable(),
  hasGiftAssignments: z.boolean(),
  hasGiftStealing: z.boolean(),
  location: z.string(),
  name: z.string(),
  notes: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateParty),
  resolver.authorize(),
  async (input, ctx) => {
    ctx.session.$isAuthorized()

    if (!input.name) throw new Error("invalid party name")

    const userId = ctx.session.userId
    const mergedEventDate = mergeDateWithHtmlTime(
      new Date(input.eventDate || ""),
      input.eventTime || ""
    )
    const { eventTime, ...inputsToKeep } = input
    const augmented: Prisma.PartyCreateInput | Prisma.PartyUncheckedCreateInput = {
      ...inputsToKeep,
      ...{ eventDate: mergedEventDate, userId },
    }

    const party = await db.party.create({ data: augmented })

    return party
  }
)
