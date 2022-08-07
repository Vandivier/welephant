import { Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getWevent from "app/wevents/queries/getWevent";
import updateWevent from "app/wevents/mutations/updateWevent";
import { WeventForm, FORM_ERROR } from "app/wevents/components/WeventForm";

export const EditWevent = () => {
  const router = useRouter();
  const weventId = useParam("weventId", "number");
  const [wevent, { setQueryData }] = useQuery(
    getWevent,
    { id: weventId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateWeventMutation] = useMutation(updateWevent);

  return (
    <>
      <Head>
        <title>Edit Wevent {wevent.id}</title>
      </Head>

      <div>
        <h1>Edit Wevent {wevent.id}</h1>
        <pre>{JSON.stringify(wevent, null, 2)}</pre>

        <WeventForm
          submitText="Update Wevent"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateWevent}
          initialValues={wevent}
          onSubmit={async (values) => {
            try {
              const updated = await updateWeventMutation({
                id: wevent.id,
                ...values,
              });
              await setQueryData(updated);
              router.push({
                pathname: `/wevents/[weventId]`,
                query: { weventId: updated.id },
              });
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

const EditWeventPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditWevent />
      </Suspense>

      <p>
        <Link href={{ pathname: "/wevents" }}>
          <a>Wevents</a>
        </Link>
      </p>
    </div>
  );
};

EditWeventPage.authenticate = true;
EditWeventPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditWeventPage;
