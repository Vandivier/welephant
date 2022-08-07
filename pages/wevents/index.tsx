import { Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getWevents from "app/wevents/queries/getWevents";

const ITEMS_PER_PAGE = 100;

export const WeventsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ wevents, hasMore }] = usePaginatedQuery(getWevents, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {wevents.map((wevent) => (
          <li key={wevent.id}>
            <Link
              href={{
                pathname: "/wevents/[weventId]",
                query: { weventId: wevent.id },
              }}
            >
              <a>{wevent.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
};

const WeventsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Wevents</title>
      </Head>

      <div>
        <p>
          <Link href={{ pathname: "/wevents/new" }}>
            <a>Create Wevent</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <WeventsList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default WeventsPage;
