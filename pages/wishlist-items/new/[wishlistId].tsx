import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createWishlistItem from "app/wishlist-items/mutations/createWishlistItem"
import { WishlistItemForm, FORM_ERROR } from "app/wishlist-items/components/WishlistItemForm"
import getWishlist from "app/wishlists/queries/getWishlist"

// ref: https://blitzjs.com/docs/redirects#on-the-server
// ref: https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props#context-parameter
export const getServerSideProps = async (context) => {
  const params = context?.params
  const wishlistId = parseInt(params.wishlistId, 10)

  if (isNaN(wishlistId)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return { props: { wishlistId } }
}

const NewWishlistItemForWishlistPage = (props: { wishlistId: number }) => {
  const router = useRouter()
  const [createWishlistItemMutation] = useMutation(createWishlistItem)
  const wishlistId = props.wishlistId
  const [wishlist] = useQuery(getWishlist, { id: wishlistId })

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
              pathname: `/wishlist-items/[wishlistItemId]`,
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
        <Link href={{ pathname: "/wishlist-items" }}>
          <a>WishlistItems</a>
        </Link>
      </p>
    </Layout>
  )
}

NewWishlistItemForWishlistPage.authenticate = true

export default NewWishlistItemForWishlistPage
