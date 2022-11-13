import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "app/core/layouts/Layout"
import getParty from "app/parties/queries/getParty"
import assignGiftersWithinParty from "app/parties/mutations/assignGiftersWithinParty"
import deleteParty from "app/parties/mutations/deleteParty"
import React from "react"
import { ERROR_STYLE } from "app/parties/participants/components/ParticipantForm"

const ONE_REM_MARGIN = { margin: "1rem" }

export const Party = () => {
  const router = useRouter()
  const partyId = useParam("partyId", "number")
  const [assignGiftersMutation] = useMutation(assignGiftersWithinParty)
  const [deletePartyMutation] = useMutation(deleteParty)
  const [party] = useQuery(getParty, { id: partyId })
  const [assignmentError, setAssignmentError] = React.useState("")

  return (
    <>
      <Head>
        <title>Party {party.name}</title>
      </Head>

      <div>
        <h1>Party {party.name}</h1>
        {party.notes ? (
          <>
            <h3>Some notes 📝for this party🎉</h3>
            <p>{party.notes}</p>
          </>
        ) : null}
        <p>Have gifters already been assigned? {party.assignedAt ? "Yes" : "No"}</p>
        <p>
          Who were you assigned? (Only you can see this bc ur logged in...){" "}
          <span style={{ textDecoration: "underline" }}>{"No one! lol"}</span>
        </p>

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

        <div style={ONE_REM_MARGIN}>
          <button
            type="button"
            onClick={async () => {
              try {
                await assignGiftersMutation({ id: party.id })
                setAssignmentError("")
              } catch (err) {
                setAssignmentError(
                  err?.message || "There was an error while trying to assign gifters"
                )
              }
            }}
            style={{ marginLeft: "0.5rem" }}
          >
            Randomly Assign Gifters
          </button>
          {assignmentError ? <p style={ERROR_STYLE}>{assignmentError}</p> : null}
        </div>

        <div style={ONE_REM_MARGIN}>
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
