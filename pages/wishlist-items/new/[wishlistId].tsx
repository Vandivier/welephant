import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createWishlistItem from "app/wishlist-items/mutations/createWishlistItem"
import { WishlistItemForm, FORM_ERROR } from "app/wishlist-items/components/WishlistItemForm"
import { useParam } from "@blitzjs/next"
import getWishlist from "app/wishlists/queries/getWishlist"

const NewWishlistItemForWishlistPage = () => {
  const router = useRouter()
  const [createWishlistItemMutation] = useMutation(createWishlistItem)
  const wishlistId = useParam("wishlistId", "number")
  const [wishlist] = useQuery(
    getWishlist,
    { id: wishlistId },
    {
      staleTime: Infinity,
    }
  )

  return (
    <Layout title={"Create New WishlistItem"}>
      <h1>Create New WishlistItem</h1>
      <p>
        This item will be added to the wishlist named{" "}
        <Link
          href={{
            pathname: "/wishlists/[wishlistId]",
            query: { wishlistId: wishlist.id },
          }}
        >
          <a className="button display-block small width-180">{wishlist.name}</a>
        </Link>
      </p>

      <WishlistItemForm
        submitText="Create WishlistItem"
        onSubmit={async (values) => {
          try {
            const wishlistItem = await createWishlistItemMutation({ ...values, wishlistId })
            await router.push({
              pathname: `/wishlistItems/[wishlistItemId]`,
              query: { wishlistItemId: wishlistItem.id },
            })
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={{ pathname: "/wishlistItems" }}>
          <a>WishlistItems</a>
        </Link>
      </p>
    </Layout>
  )
}

NewWishlistItemForWishlistPage.authenticate = true

export default NewWishlistItemForWishlistPage
