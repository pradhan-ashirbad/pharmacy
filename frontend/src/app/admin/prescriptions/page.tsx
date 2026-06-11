import type { Metadata } from "next";

import { PrescriptionsManager } from "./prescriptions-manager";

export const metadata: Metadata = {
  title: "Prescription Management",
};

export default function AdminPrescriptionsPage() {
  return <PrescriptionsManager />;
}
