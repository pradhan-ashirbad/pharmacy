"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileCheck2,
  LayoutDashboard,
  Menu,
  Package,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/prescriptions", label: "Prescriptions", icon: FileCheck2 },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <link.icon className="h-4 w-4 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-card p-5 lg:flex">
        <div className="flex items-center gap-2">
          <Logo />
          <Badge variant="soft" className="ml-1">
            Admin
          </Badge>
        </div>
        <div className="mt-8 flex-1">
          <NavLinks />
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Store className="h-4 w-4" />
          Back to Store
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-lg sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open admin menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetTitle className="sr-only">Admin navigation</SheetTitle>
              <div className="mt-2 flex items-center gap-2">
                <Logo />
                <Badge variant="soft">Admin</Badge>
              </div>
              <div className="mt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-sm font-semibold text-muted-foreground">
            MediKart Admin Console
          </h1>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-sm">AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 bg-muted/30 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
