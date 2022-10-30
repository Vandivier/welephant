import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createParty from "app/parties/mutations/createParty";
import { PartyForm, FORM_ERROR } from "app/parties/components/PartyForm";

const NewPartyPage = () => {
  const router = useRouter();
  const [createPartyMutation] = useMutation(createParty);

  return (
    <Layout title={"Create New Party"}>
      <h1>Create New Party</h1>

      <PartyForm
        submitText="Create Party"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateParty}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const party = await createPartyMutation(values);
            await router.push(Routes.ShowPartyPage({ partyId: party.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.PartiesPage()}>
          <a>Parties</a>
        </Link>
      </p>
    </Layout>
  );
};

NewPartyPage.authenticate = true;

export default NewPartyPage;
