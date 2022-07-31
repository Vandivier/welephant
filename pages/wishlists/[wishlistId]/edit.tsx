import { Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getWishlist from "app/wishlists/queries/getWishlist";
import updateWishlist from "app/wishlists/mutations/updateWishlist";
import {
  WishlistForm,
  FORM_ERROR,
} from "app/wishlists/components/WishlistForm";

export const EditWishlist = () => {
  const router = useRouter();
  const wishlistId = useParam("wishlistId", "number");
  const [wishlist, { setQueryData }] = useQuery(
    getWishlist,
    { id: wishlistId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateWishlistMutation] = useMutation(updateWishlist);

  return (
    <>
      <Head>
        <title>Edit Wishlist {wishlist.id}</title>
      </Head>

      <div>
        <h1>Edit Wishlist {wishlist.id}</h1>
        <pre>{JSON.stringify(wishlist, null, 2)}</pre>

        <WishlistForm
          submitText="Update Wishlist"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateWishlist}
          initialValues={wishlist}
          onSubmit={async (values) => {
            try {
              const updated = await updateWishlistMutation({
                id: wishlist.id,
                ...values,
              });
              await setQueryData(updated);
              router.push({
                pathname: `/wishlists/[wishlistId]`,
                query: { wishlistId: updated.id },
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

const EditWishlistPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditWishlist />
      </Suspense>

      <p>
        <Link href={{ pathname: "/wishlists" }}>
          <a>Wishlists</a>
        </Link>
      </p>
    </div>
  );
};

EditWishlistPage.authenticate = true;
EditWishlistPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditWishlistPage;
