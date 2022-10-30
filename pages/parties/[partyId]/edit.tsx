import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getParty from "app/parties/queries/getParty";
import updateParty from "app/parties/mutations/updateParty";
import { PartyForm, FORM_ERROR } from "app/parties/components/PartyForm";

export const EditParty = () => {
  const router = useRouter();
  const partyId = useParam("partyId", "number");
  const [party, { setQueryData }] = useQuery(
    getParty,
    { id: partyId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updatePartyMutation] = useMutation(updateParty);

  return (
    <>
      <Head>
        <title>Edit Party {party.id}</title>
      </Head>

      <div>
        <h1>Edit Party {party.id}</h1>
        <pre>{JSON.stringify(party, null, 2)}</pre>

        <PartyForm
          submitText="Update Party"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateParty}
          initialValues={party}
          onSubmit={async (values) => {
            try {
              const updated = await updatePartyMutation({
                id: party.id,
                ...values,
              });
              await setQueryData(updated);
              await router.push(Routes.ShowPartyPage({ partyId: updated.id }));
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </div>
    </>
  );
};

const EditPartyPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditParty />
      </Suspense>

      <p>
        <Link href={Routes.PartiesPage()}>
          <a>Parties</a>
        </Link>
      </p>
    </div>
  );
};

EditPartyPage.authenticate = true;
EditPartyPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditPartyPage;
