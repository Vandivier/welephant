import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "app/core/layouts/Layout"
import getParticipant from "app/parties/participants/queries/getParticipant"
import updateParticipant from "app/parties/participants/mutations/updateParticipant"
import { ParticipantForm, FORM_ERROR } from "app/parties/participants/components/ParticipantForm"

export const EditParticipant = ({ partyId }: { partyId: number }) => {
  const router = useRouter()
  const participantId = useParam("participantId", "number")
  const [participant, { setQueryData }] = useQuery(
    getParticipant,
    { id: participantId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateParticipantMutation] = useMutation(updateParticipant)

  return (
    <>
      <Head>
        <title>Edit Participant {participant.id}</title>
      </Head>

      <div>
        <h1>Edit Participant {participant.id}</h1>
        <pre>{JSON.stringify(participant, null, 2)}</pre>

        <ParticipantForm
          submitText="Update Participant"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateParticipant}
          initialValues={participant}
          onSubmit={async (values) => {
            try {
              const updated = await updateParticipantMutation({
                id: participant.id,
                ...values,
              })
              await setQueryData(updated)
              await router.push(Routes.ShowParticipantPage({ partyId, participantId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditParticipantPage = () => {
  const sPartyId = useParam("partyId", "string")
  const partyId = parseInt(sPartyId || "", 10)

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditParticipant partyId={partyId} />
      </Suspense>

      <p>
        <Link href={Routes.ParticipantsPage({ partyId })}>
          <a>Participants</a>
        </Link>
      </p>
    </div>
  )
}

EditParticipantPage.authenticate = true
EditParticipantPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditParticipantPage
