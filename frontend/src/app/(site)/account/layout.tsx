import type { Metadata } from "next";

import { AccountNav } from "./account-nav";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-8">
      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        My Account
      </h1>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[240px_1fr]">
        <AccountNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
