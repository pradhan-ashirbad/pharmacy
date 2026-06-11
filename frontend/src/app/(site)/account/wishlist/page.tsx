import type { Metadata } from "next";

import { WishlistView } from "./wishlist-view";

export const metadata: Metadata = {
  title: "My Wishlist",
};

export default function WishlistPage() {
  return <WishlistView />;
}
