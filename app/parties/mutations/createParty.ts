import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z } from "zod"

const CreateParty = z.object({
  hasGiftAssignments: z.boolean(),
  hasGiftStealing: z.boolean(),
  name: z.string(),
  notes: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateParty),
  resolver.authorize(),
  async (input, ctx) => {
    ctx.session.$isAuthorized()

    const userId = ctx.session.userId
    const augmented: Prisma.PartyCreateInput | Prisma.PartyUncheckedCreateInput = {
      ...input,
      ...{ userId },
    }

    const party = await db.party.create({ data: augmented })

    return party
  }
)
