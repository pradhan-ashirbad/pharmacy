"use client";

import * as React from "react";
import Link from "next/link";
import { FileText, Heart, Package, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { useAccountStore } from "@/store/account";
import { useAuthStore, demoUser } from "@/store/auth";
import { useWishlistStore } from "@/store/wishlist";

export function ProfileView() {
  const mounted = useMounted();
  const { user, isLoggedIn, login, updateProfile } = useAuthStore();
  const orders = useAccountStore((s) => s.orders);
  const prescriptions = useAccountStore((s) => s.prescriptions);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const activeUser = user ?? demoUser;
  const [form, setForm] = React.useState({ name: "", email: "", phone: "" });
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    if (mounted) {
      setForm({
        name: activeUser.name,
        email: activeUser.email,
        phone: activeUser.phone,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, activeUser.id]);

  if (!mounted) {
    return <Skeleton className="h-96 rounded-2xl" />;
  }

  const stats = [
    { icon: Package, label: "Orders", value: orders.length, href: "/account/orders" },
    { icon: Heart, label: "Wishlist", value: wishlistCount, href: "/account/wishlist" },
    {
      icon: FileText,
      label: "Prescriptions",
      value: prescriptions.length,
      href: "/account/prescriptions",
    },
  ];

  const save = () => {
    if (!isLoggedIn) login({ ...demoUser, ...form });
    else updateProfile(form);
    setEditing(false);
    toast.success("Profile updated");
  };

  return (
    <div className="space-y-6">
      {!isLoggedIn && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-accent/50 p-4">
          <p className="text-sm">
            <span className="font-semibold">You&apos;re browsing as a guest.</span>{" "}
            Login to sync your orders and prescriptions.
          </p>
          <Button asChild size="sm">
            <Link href="/login">Login / Register</Link>
          </Button>
        </div>
      )}

      <div className="rounded-2xl border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">
              {activeUser.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{activeUser.name}</h2>
            <p className="text-sm text-muted-foreground">{activeUser.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => setEditing((v) => !v)}
          >
            <UserRound className="h-4 w-4" />
            {editing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        {editing && (
          <div className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Full name</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-email">Email</Label>
              <Input
                id="p-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-phone">Phone</Label>
              <Input
                id="p-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={save}>Save Changes</Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border bg-card p-5 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
          >
            <stat.icon className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 font-display text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
