import { Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getWishlistItem from "app/wishlist-items/queries/getWishlistItem";
import updateWishlistItem from "app/wishlist-items/mutations/updateWishlistItem";
import {
  WishlistItemForm,
  FORM_ERROR,
} from "app/wishlist-items/components/WishlistItemForm";

export const EditWishlistItem = () => {
  const router = useRouter();
  const wishlistItemId = useParam("wishlistItemId", "number");
  const [wishlistItem, { setQueryData }] = useQuery(
    getWishlistItem,
    { id: wishlistItemId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateWishlistItemMutation] = useMutation(updateWishlistItem);

  return (
    <>
      <Head>
        <title>Edit WishlistItem {wishlistItem.id}</title>
      </Head>

      <div>
        <h1>Edit WishlistItem {wishlistItem.id}</h1>
        <pre>{JSON.stringify(wishlistItem, null, 2)}</pre>

        <WishlistItemForm
          submitText="Update WishlistItem"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateWishlistItem}
          initialValues={wishlistItem}
          onSubmit={async (values) => {
            try {
              const updated = await updateWishlistItemMutation({
                id: wishlistItem.id,
                ...values,
              });
              await setQueryData(updated);
              router.push({
                pathname: `/wishlistItems/[wishlistItemId]`,
                query: { wishlistItemId: updated.id },
              });
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </div>
    </>
  );
};

const EditWishlistItemPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditWishlistItem />
      </Suspense>

      <p>
        <Link href={{ pathname: "/wishlistItems" }}>
          <a>WishlistItems</a>
        </Link>
      </p>
    </div>
  );
};

EditWishlistItemPage.authenticate = true;
EditWishlistItemPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditWishlistItemPage;
