import { Suspense } from "react"

import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "app/core/layouts/Layout"
import getWishlistItem from "app/wishlist-items/queries/getWishlistItem"
import deleteWishlistItem from "app/wishlist-items/mutations/deleteWishlistItem"

export const WishlistItem = () => {
  const router = useRouter()
  const wishlistItemId = useParam("wishlistItemId", "number")
  const [deleteWishlistItemMutation] = useMutation(deleteWishlistItem)
  const [wishlistItem] = useQuery(getWishlistItem, { id: wishlistItemId })

  return (
    <>
      <Head>
        <title>WishlistItem {wishlistItem.id}</title>
      </Head>

      <div>
        <h1>WishlistItem {wishlistItem.id}</h1>
        <pre>{JSON.stringify(wishlistItem, null, 2)}</pre>

        <Link
          href={{
            pathname: "/wishlistItems/[wishlistItemId]/edit",
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
              await router.push({ pathname: "/wishlistItems" })
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
        <Link href={{ pathname: "/wishlistItems" }}>
          <a>WishlistItems</a>
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
