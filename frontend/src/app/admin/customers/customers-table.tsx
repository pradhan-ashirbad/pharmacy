"use client";

import * as React from "react";
import { Search, ShieldBan, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminCustomers } from "@/data/admin";
import { formatDate, formatINR } from "@/lib/utils";
import type { AdminCustomer } from "@/types";

export function CustomersTable() {
  // Local working copy — in production this talks to /api/admin/customers.
  const [customers, setCustomers] = React.useState<AdminCustomer[]>(adminCustomers);
  const [query, setQuery] = React.useState("");

  const filtered = customers.filter((c) =>
    [c.name, c.email, c.city, c.id].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setCustomers((list) =>
      list.map((c) => {
        if (c.id !== id) return c;
        const status = c.status === "active" ? "blocked" : "active";
        toast(status === "blocked" ? "Customer blocked" : "Customer unblocked", {
          description: c.name,
        });
        return { ...c, status };
      })
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Customers</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {customers.length} registered customers
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email or city…"
          aria-label="Search customers"
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card shadow-soft">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3.5 font-semibold">Customer</th>
              <th className="px-5 py-3.5 font-semibold">Contact</th>
              <th className="px-5 py-3.5 font-semibold">City</th>
              <th className="px-5 py-3.5 font-semibold">Joined</th>
              <th className="px-5 py-3.5 font-semibold">Orders</th>
              <th className="px-5 py-3.5 font-semibold">Lifetime Value</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((customer) => (
              <tr key={customer.id} className="transition-colors hover:bg-muted/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {customer.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-muted-foreground">{customer.email}</p>
                  <p className="text-xs text-muted-foreground">{customer.phone}</p>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{customer.city}</td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {formatDate(customer.joinedOn)}
                </td>
                <td className="px-5 py-3.5">{customer.totalOrders}</td>
                <td className="px-5 py-3.5 font-semibold">
                  {formatINR(customer.totalSpent)}
                </td>
                <td className="px-5 py-3.5">
                  {customer.status === "active" ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Blocked</Badge>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatus(customer.id)}
                    className={
                      customer.status === "active"
                        ? "text-destructive hover:text-destructive"
                        : "text-success hover:text-success"
                    }
                  >
                    {customer.status === "active" ? (
                      <>
                        <ShieldBan className="h-4 w-4" /> Block
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" /> Unblock
                      </>
                    )}
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                  No customers match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
