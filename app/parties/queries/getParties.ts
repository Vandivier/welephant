import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetPartiesInput
  extends Pick<
    Prisma.PartyFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetPartiesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: parties,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.party.count({ where }),
      query: (paginateArgs) =>
        db.party.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      parties,
      nextPage,
      hasMore,
      count,
    };
  }
);
