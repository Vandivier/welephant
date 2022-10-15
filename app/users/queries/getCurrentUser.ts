import { Ctx } from "blitz"
import db, { User } from "db"

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  let user: null | Partial<User> = null

  try {
    if (!session.userId) return null

    user = await db.user.findFirst({
      where: { id: session.userId as number },
      select: { id: true, name: true, email: true, role: true },
    })
  } catch (err) {
    console.log(`error in getCurrentUser: ${{ err }}`)
  }

  return user
}
