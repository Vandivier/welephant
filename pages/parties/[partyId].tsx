import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "app/core/layouts/Layout"
import getParty from "app/parties/queries/getParty"
import deleteParty from "app/parties/mutations/deleteParty"

export const Party = () => {
  const router = useRouter()
  const partyId = useParam("partyId", "number")
  const [deletePartyMutation] = useMutation(deleteParty)
  const [party] = useQuery(getParty, { id: partyId })

  return (
    <>
      <Head>
        <title>Party {party.id}</title>
      </Head>

      <div>
        <h1>Party {party.id}</h1>
        <pre>{JSON.stringify(party, null, 2)}</pre>

        <p>
          <Link href={Routes.ParticipantsPage({ partyId: party.id })}>
            <a>View Participants in this Event</a>
          </Link>
        </p>

        <p>
          <Link href={Routes.EditPartyPage({ partyId: party.id })}>
            <a>Edit</a>
          </Link>
        </p>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deletePartyMutation({ id: party.id })
              await router.push(Routes.PartiesPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowPartyPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.PartiesPage()}>
          <a>Parties</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Party />
      </Suspense>
    </div>
  )
}

ShowPartyPage.authenticate = true
ShowPartyPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowPartyPage
