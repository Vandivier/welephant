import { Suspense } from "react"

import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "app/core/layouts/Layout"
import getWishlist from "app/wishlists/queries/getWishlist"
import deleteWishlist from "app/wishlists/mutations/deleteWishlist"

export const Wishlist = () => {
  const router = useRouter()
  const wishlistId = useParam("wishlistId", "number")
  const [deleteWishlistMutation] = useMutation(deleteWishlist)
  const [wishlist] = useQuery(getWishlist, { id: wishlistId })

  return (
    <>
      <Head>
        <title>Wishlist {wishlist.id}</title>
      </Head>

      <div>
        <h1>Wishlist {wishlist.id}</h1>
        <pre>{JSON.stringify(wishlist, null, 2)}</pre>

        <Link
          href={{
            pathname: "/wishlists/[wishlistId]/edit",
            query: { wishlistId: wishlist.id },
          }}
        >
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteWishlistMutation({ id: wishlist.id })
              await router.push({ pathname: "/wishlists" })
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

const ShowWishlistPage = () => {
  return (
    <div>
      <p>
        <Link href={{ pathname: "/wishlists" }}>
          <a>Wishlists</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Wishlist />
      </Suspense>
    </div>
  )
}

ShowWishlistPage.authenticate = true
ShowWishlistPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowWishlistPage
