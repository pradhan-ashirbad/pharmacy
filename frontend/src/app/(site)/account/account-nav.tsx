"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  FileText,
  Heart,
  LogOut,
  MapPin,
  Package,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/store/account";
import { useAuthStore } from "@/store/auth";

const links = [
  { href: "/account", label: "Profile", icon: User, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Saved Addresses", icon: MapPin },
  { href: "/account/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
];

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useMounted();
  const logout = useAuthStore((s) => s.logout);
  const unread = useAccountStore((s) =>
    mounted ? s.notifications.filter((n) => !n.read).length : 0
  );

  return (
    <nav className="rounded-2xl border bg-card p-2.5 shadow-soft lg:sticky lg:top-40">
      <ul className="flex gap-1 overflow-x-auto scrollbar-none lg:flex-col">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <li key={link.href} className="shrink-0 lg:shrink">
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                {link.label}
                {link.href === "/account/notifications" && unread > 0 && (
                  <Badge className="ml-auto h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">
                    {unread}
                  </Badge>
                )}
              </Link>
            </li>
          );
        })}
        <li className="shrink-0 lg:mt-1 lg:shrink lg:border-t lg:pt-1">
          <button
            type="button"
            onClick={() => {
              logout();
              toast("Logged out");
              router.push("/");
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </li>
      </ul>
    </nav>
  );
}
