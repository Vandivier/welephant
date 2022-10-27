import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getParticipants from "app/participants/queries/getParticipants";

const ITEMS_PER_PAGE = 100;

export const ParticipantsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ participants, hasMore }] = usePaginatedQuery(getParticipants, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {participants.map((participant) => (
          <li key={participant.id}>
            <Link
              href={Routes.ShowParticipantPage({
                participantId: participant.id,
              })}
            >
              <a>{participant.name}</a>
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

const ParticipantsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Participants</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewParticipantPage()}>
            <a>Create Participant</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ParticipantsList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default ParticipantsPage;
