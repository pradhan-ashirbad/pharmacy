import type { Metadata } from "next";

import { CustomersTable } from "./customers-table";

export const metadata: Metadata = {
  title: "Customer Management",
};

export default function AdminCustomersPage() {
  return <CustomersTable />;
}
