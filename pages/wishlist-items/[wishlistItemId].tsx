import { Suspense } from "react"

import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "app/core/layouts/Layout"
import getWishlistItemWithWisher from "app/wishlist-items/queries/getWishlistItemWithWisher"
import deleteWishlistItem from "app/wishlist-items/mutations/deleteWishlistItem"

export const WishlistItem = () => {
  const router = useRouter()
  const wishlistItemId = useParam("wishlistItemId", "number")
  const [deleteWishlistItemMutation] = useMutation(deleteWishlistItem)
  const [wishlistItem] = useQuery(getWishlistItemWithWisher, { id: wishlistItemId })

  return (
    <>
      <Head>
        <title>WishlistItem {wishlistItem.id}</title>
      </Head>

      <div>
        <h1>{wishlistItem.name}</h1>
        <h2>Wished by {wishlistItem.wisher.name}</h2>
        <p>
          <Link href={{ pathname: `/wishlists/${wishlistItem.wishlistId}` }}>
            <a>View all items in this wishlist</a>
          </Link>
        </p>

        <Link
          href={{
            pathname: "/wishlist-items/[wishlistItemId]/edit",
            query: { wishlistItemId: wishlistItem.id },
          }}
        >
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteWishlistItemMutation({ id: wishlistItem.id })
              await router.push({ pathname: "/wishlist-items" })
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

const ShowWishlistItemPage = () => {
  return (
    <div>
      <p>
        <Link href={{ pathname: "/" }}>
          <a>Return Home</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <WishlistItem />
      </Suspense>
    </div>
  )
}

ShowWishlistItemPage.authenticate = true
ShowWishlistItemPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowWishlistItemPage
