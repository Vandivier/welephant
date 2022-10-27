import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getParticipant from "app/participants/queries/getParticipant";
import deleteParticipant from "app/participants/mutations/deleteParticipant";

export const Participant = () => {
  const router = useRouter();
  const participantId = useParam("participantId", "number");
  const [deleteParticipantMutation] = useMutation(deleteParticipant);
  const [participant] = useQuery(getParticipant, { id: participantId });

  return (
    <>
      <Head>
        <title>Participant {participant.id}</title>
      </Head>

      <div>
        <h1>Participant {participant.id}</h1>
        <pre>{JSON.stringify(participant, null, 2)}</pre>

        <Link
          href={Routes.EditParticipantPage({ participantId: participant.id })}
        >
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteParticipantMutation({ id: participant.id });
              await router.push(Routes.ParticipantsPage());
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowParticipantPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.ParticipantsPage()}>
          <a>Participants</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Participant />
      </Suspense>
    </div>
  );
};

ShowParticipantPage.authenticate = true;
ShowParticipantPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowParticipantPage;
