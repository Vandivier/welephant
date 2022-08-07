import { paginate, Ctx } from "blitz";
import db from "db";
import { Prisma } from "@prisma/client";

interface GetWeventsInput
  extends Pick<
    Prisma.WeventFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default async function Get__ModelNames(
  input: GetWeventsInput,
  ctx: Ctx
) {
  ctx.session.$isAuthorized();

  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const {
    items: wevents,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip: input.skip,
    take: input.take,
    count: () => db.wevent.count({ where: input.where }),
    query: (paginateArgs) =>
      db.wevent.findMany({
        ...paginateArgs,
        where: input.where,
        orderBy: input.orderBy,
      }),
  });

  return {
    wevents,
    nextPage,
    hasMore,
    count,
  };
}
