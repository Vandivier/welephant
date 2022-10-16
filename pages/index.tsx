import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/users/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import logo from "public/wele-boi-logo.png"
import { useMutation } from "@blitzjs/rpc"
import { Routes, BlitzPage } from "@blitzjs/next"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
        <div>
          User id: <code>{currentUser.id}</code>
          <br />
          User role: <code>{currentUser.role}</code>
        </div>
      </>
    )
  } else {
    return (
      <>
        <Link href={Routes.SignupPage()}>
          <a className="button small">
            <strong>Sign Up</strong>
          </a>
        </Link>
        <Link href={Routes.LoginPage()}>
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link>
      </>
    )
  }
}

const Home: BlitzPage = () => {
  return (
    <Layout title="Home">
      <div className="container">
        <main>
          <div className="logo">
            {/* <div className="logo" style={{ height: "1vh", width: "1vw" }}> */}
            <Image
              src={`${logo.src}`}
              alt="welephant logo"
              width="250px"
              height="249px"
              layout="fixed"
            />
          </div>
          <p style={{ marginBottom: 0 }}>
            <strong>Welcome to Welephant!</strong>
          </p>
          <p style={{ marginTop: 0 }}>
            A{" "}
            <a
              href="https://en.wikipedia.org/w/index.php?title=White_elephant&oldid=1107958304"
              target="_blank"
              rel="noreferrer"
            >
              white elephant gift exchange
            </a>{" "}
            assistant / party planner / thingy.
          </p>
          <div className="buttons" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <Suspense fallback="Loading...">
              <UserInfo />
            </Suspense>
          </div>
          <p>
            <strong>To create a new wishlist, push dis:</strong>
            <a className="button display-block small" href="/wishlists">
              <strong>Dis</strong>
            </a>
          </p>
          <div className="buttons" style={{ marginTop: "5rem" }}>
            <a
              className="button-outline"
              href="https://github.com/Vandivier/welephant"
              target="_blank"
              rel="noopener noreferrer"
            >
              Welephant Github Repo
            </a>
          </div>
        </main>

        <footer>
          <a
            href="https://vandivier.github.io/not-johns-linktree/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built by John Vandivier
          </a>
        </footer>

        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;700&display=swap");

          html,
          body {
            padding: 0;
            margin: 0;
            font-family: "Libre Franklin", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          }

          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            box-sizing: border-box;
          }
          .container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          main p {
            font-size: 1.2rem;
          }

          p {
            text-align: center;
          }

          footer {
            width: 100%;
            height: 60px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #45009d;
          }

          footer a {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          footer a {
            color: #f4f4f4;
            text-decoration: none;
          }

          .logo {
            margin-bottom: 2rem;
          }

          .buttons {
            display: grid;
            grid-auto-flow: column;
            grid-gap: 0.5rem;
          }

          .button {
            background-color: #6700eb;
            color: #f4f4f4;
            cursor: pointer;
            font-size: 1rem;
            padding: 1rem 2rem;
            text-align: center;
          }

          .button.small {
            padding: 0.5rem 1rem;
          }

          .button:hover {
            background-color: #45009d;
          }

          .button-outline {
            border: 2px solid #6700eb;
            padding: 1rem 2rem;
            color: #6700eb;
            text-align: center;
          }

          .button-outline:hover {
            border-color: #45009d;
            color: #45009d;
          }

          pre {
            background: #fafafa;
            border-radius: 5px;
            padding: 0.75rem;
            text-align: center;
          }
          code {
            font-size: 0.9rem;
            font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
              Bitstream Vera Sans Mono, Courier New, monospace;
          }

          .grid {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;

            max-width: 800px;
            margin-top: 3rem;
          }

          @media (max-width: 600px) {
            .grid {
              width: 100%;
              flex-direction: column;
            }
          }

          .display-block {
            display: block;
          }
        `}</style>
      </div>
    </Layout>
  )
}

export default Home
