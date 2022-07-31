import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "app/core/layouts/Layout"
import createWishlist from "app/wishlists/mutations/createWishlist"
import { WishlistForm, FORM_ERROR } from "app/wishlists/components/WishlistForm"

const NewWishlistPage = () => {
  const router = useRouter()
  const [createWishlistMutation] = useMutation(createWishlist)

  return (
    <Layout title={"Create New Wishlist"}>
      <h1>Create New Wishlist</h1>

      <WishlistForm
        submitText="Create Wishlist"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateWishlist}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const wishlist = await createWishlistMutation(values)
            router.push({
              pathname: `/wishlists/[wishlistId]`,
              query: { wishlistId: wishlist.id },
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
        <Link href={{ pathname: "/wishlists" }}>
          <a>Wishlists</a>
        </Link>
      </p>
    </Layout>
  )
}

NewWishlistPage.authenticate = true

export default NewWishlistPage
