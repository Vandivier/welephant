import { Suspense } from "react"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "app/core/layouts/Layout"
import getWishlistItems from "app/wishlist-items/queries/getWishlistItems"

export const ITEMS_PER_PAGE = 100

export const WishlistItemsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ wishlistItems, hasMore }] = usePaginatedQuery(getWishlistItems, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {wishlistItems.map((wishlistItem) => (
          <li key={wishlistItem.id}>
            <Link
              href={{
                pathname: "/wishlistItems/[wishlistItemId]",
                query: { wishlistItemId: wishlistItem.id },
              }}
            >
              <a>{wishlistItem.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const WishlistItemsPage = () => {
  return (
    <Layout>
      <Head>
        <title>WishlistItems</title>
      </Head>

      <div>
        <p>
          <Link href={{ pathname: "/wishlistItems/new" }}>
            <a>Create WishlistItem</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <WishlistItemsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default WishlistItemsPage
