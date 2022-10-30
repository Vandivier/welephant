import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getParties from "app/parties/queries/getParties";

const ITEMS_PER_PAGE = 100;

export const PartiesList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ parties, hasMore }] = usePaginatedQuery(getParties, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {parties.map((party) => (
          <li key={party.id}>
            <Link href={Routes.ShowPartyPage({ partyId: party.id })}>
              <a>{party.name}</a>
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

const PartiesPage = () => {
  return (
    <Layout>
      <Head>
        <title>Parties</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewPartyPage()}>
            <a>Create Party</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <PartiesList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default PartiesPage;
