import { Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getWishlists from "app/wishlists/queries/getWishlists";

const ITEMS_PER_PAGE = 100;

export const WishlistsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ wishlists, hasMore }] = usePaginatedQuery(getWishlists, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {wishlists.map((wishlist) => (
          <li key={wishlist.id}>
            <Link
              href={{
                pathname: "/wishlists/[wishlistId]",
                query: { wishlistId: wishlist.id },
              }}
            >
              <a>{wishlist.name}</a>
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
  );
};

const WishlistsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Wishlists</title>
      </Head>

      <div>
        <p>
          <Link href={{ pathname: "/wishlists/new" }}>
            <a>Create Wishlist</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <WishlistsList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default WishlistsPage;
