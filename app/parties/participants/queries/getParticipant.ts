import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetParticipant = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetParticipant), resolver.authorize(), async ({ id }) => {
  const participant = await db.participant.findFirst({ where: { id } })

  if (!participant) throw new NotFoundError()

  return participant
})
