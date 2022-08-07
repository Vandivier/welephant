import { Suspense } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getWevent from "app/wevents/queries/getWevent";
import deleteWevent from "app/wevents/mutations/deleteWevent";

export const Wevent = () => {
  const router = useRouter();
  const weventId = useParam("weventId", "number");
  const [deleteWeventMutation] = useMutation(deleteWevent);
  const [wevent] = useQuery(getWevent, { id: weventId });

  return (
    <>
      <Head>
        <title>Wevent {wevent.id}</title>
      </Head>

      <div>
        <h1>Wevent {wevent.id}</h1>
        <pre>{JSON.stringify(wevent, null, 2)}</pre>

        <Link
          href={{
            pathname: "/wevents/[weventId]/edit",
            query: { weventId: wevent.id },
          }}
        >
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteWeventMutation({ id: wevent.id });
              router.push({ pathname: "/wevents" });
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

const ShowWeventPage = () => {
  return (
    <div>
      <p>
        <Link href={{ pathname: "/wevents" }}>
          <a>Wevents</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Wevent />
      </Suspense>
    </div>
  );
};

ShowWeventPage.authenticate = true;
ShowWeventPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowWeventPage;
