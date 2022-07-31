import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createWishlistItem from "app/wishlist-items/mutations/createWishlistItem";
import {
  WishlistItemForm,
  FORM_ERROR,
} from "app/wishlist-items/components/WishlistItemForm";

const NewWishlistItemPage = () => {
  const router = useRouter();
  const [createWishlistItemMutation] = useMutation(createWishlistItem);

  return (
    <Layout title={"Create New WishlistItem"}>
      <h1>Create New WishlistItem</h1>

      <WishlistItemForm
        submitText="Create WishlistItem"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateWishlistItem}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const wishlistItem = await createWishlistItemMutation(values);
            router.push({
              pathname: `/wishlistItems/[wishlistItemId]`,
              query: { wishlistItemId: wishlistItem.id },
            });
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={{ pathname: "/wishlistItems" }}>
          <a>WishlistItems</a>
        </Link>
      </p>
    </Layout>
  );
};

NewWishlistItemPage.authenticate = true;

export default NewWishlistItemPage;