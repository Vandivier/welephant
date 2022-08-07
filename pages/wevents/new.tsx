import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createWevent from "app/wevents/mutations/createWevent";
import { WeventForm, FORM_ERROR } from "app/wevents/components/WeventForm";

const NewWeventPage = () => {
  const router = useRouter();
  const [createWeventMutation] = useMutation(createWevent);

  return (
    <Layout title={"Create New Wevent"}>
      <h1>Create New Wevent</h1>

      <WeventForm
        submitText="Create Wevent"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateWevent}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const wevent = await createWeventMutation(values);
            router.push({
              pathname: `/wevents/[weventId]`,
              query: { weventId: wevent.id },
            });
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={{ pathname: "/wevents" }}>
          <a>Wevents</a>
        </Link>
      </p>
    </Layout>
  );
};

NewWeventPage.authenticate = true;

export default NewWeventPage;
