import { Routes, useParams } from "@blitzjs/next"
import Link from "next/link"
import { NextRouter, useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createParticipant from "app/parties/participants/mutations/createParticipant"
import { ParticipantForm, FORM_ERROR } from "app/parties/participants/components/ParticipantForm"
import { useEffect } from "react"

export const handleMissingPartyId = (partyId: number, router: NextRouter) => {
  const redirect = async () => {
    console.log({ partyId })
    if (isNaN(partyId)) {
      await router.push(Routes.Home())
    }
  }

  redirect().catch(() => {
    throw new Error("Routing to Home Failed")
  })
}

const NewParticipantPage = () => {
  const router = useRouter()
  const sPartyId = router.query?.partyId
  const partyId = parseInt(typeof sPartyId === "string" ? sPartyId : "", 10)
  const [createParticipantMutation] = useMutation(createParticipant)

  useEffect(() => {
    handleMissingPartyId(partyId, router)
  }, [partyId, router])

  return (
    <Layout title={"Create New Participant"}>
      <h1>Create New Participant</h1>

      <ParticipantForm
        submitText="Create Participant"
        onSubmit={async (values) => {
          try {
            const participant = await createParticipantMutation({ ...values, partyId })
            await router.push(
              Routes.ShowParticipantPage({ participantId: participant.id, partyId })
            )
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.ParticipantsPage({ partyId })}>
          <a>View Other Participants in this Party</a>
        </Link>
      </p>
    </Layout>
  )
}

NewParticipantPage.authenticate = true

export default NewParticipantPage
