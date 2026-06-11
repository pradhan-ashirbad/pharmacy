import type { Metadata } from "next";

import { PrescriptionsView } from "./prescriptions-view";

export const metadata: Metadata = {
  title: "My Prescriptions",
};

export default function PrescriptionsPage() {
  return <PrescriptionsView />;
}
