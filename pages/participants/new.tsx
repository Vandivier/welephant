import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createParticipant from "app/participants/mutations/createParticipant";
import {
  ParticipantForm,
  FORM_ERROR,
} from "app/participants/components/ParticipantForm";

const NewParticipantPage = () => {
  const router = useRouter();
  const [createParticipantMutation] = useMutation(createParticipant);

  return (
    <Layout title={"Create New Participant"}>
      <h1>Create New Participant</h1>

      <ParticipantForm
        submitText="Create Participant"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateParticipant}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const participant = await createParticipantMutation(values);
            await router.push(
              Routes.ShowParticipantPage({ participantId: participant.id })
            );
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.ParticipantsPage()}>
          <a>Participants</a>
        </Link>
      </p>
    </Layout>
  );
};

NewParticipantPage.authenticate = true;

export default NewParticipantPage;
