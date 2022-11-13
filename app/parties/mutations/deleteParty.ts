import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteParty = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteParty), resolver.authorize(), async ({ id }) => {
  const party = await db.party.deleteMany({ where: { id } })
  return party
})
