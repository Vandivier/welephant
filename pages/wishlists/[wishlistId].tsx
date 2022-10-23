import { Suspense } from "react"

import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "app/core/layouts/Layout"
import getWishlist from "app/wishlists/queries/getWishlist"
import deleteWishlist from "app/wishlists/mutations/deleteWishlist"
import getWishlistItems from "app/wishlist-items/queries/getWishlistItems"

import { ITEMS_PER_PAGE } from "pages/wishlist-items"

export const WishlistDetailsPage = () => {
  const router = useRouter()
  const wishlistId = useParam("wishlistId", "number")
  const [deleteWishlistMutation] = useMutation(deleteWishlist)
  const [wishlist] = useQuery(getWishlist, { id: wishlistId })

  // TODO: handle pagination, see #15
  const page = 0
  const [{ wishlistItems }] = usePaginatedQuery(getWishlistItems, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    where: { wishlistId },
  })

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
            pathname: "/wishlist-items/new/[wishlistId]",
            query: { wishlistId: wishlist.id },
          }}
        >
          <a className="button display-block small width-180">Add Item to Wishlist</a>
        </Link>

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

      <section>
        <h2>Items on this Wishlist</h2>
        <ul>
          {wishlistItems?.length
            ? wishlistItems.map((item) => <li key={item.id}>{item.name}</li>)
            : "None"}
        </ul>
      </section>

      <style jsx global>{`
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

        .width-180 {
          width: 180px;
        }

        .display-block {
          display: block;
        }
      `}</style>
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
        <WishlistDetailsPage />
      </Suspense>
    </div>
  )
}

ShowWishlistPage.authenticate = true
ShowWishlistPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowWishlistPage
