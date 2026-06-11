import type { Metadata } from "next";

import { CompareView } from "./compare-view";

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare medicines, wellness products and health devices side by side.",
};

export default function ComparePage() {
  return <CompareView />;
}
