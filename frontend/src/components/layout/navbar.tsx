"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  FileUp,
  GitCompareArrows,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchBar } from "./search-bar";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useCompareStore } from "@/store/compare";
import { useWishlistStore } from "@/store/wishlist";

const navLinks = [
  { href: "/medicines", label: "Medicines" },
  { href: "/wellness", label: "Wellness" },
  { href: "/health-devices", label: "Health Devices" },
  { href: "/offers", label: "Offers" },
  { href: "/blog", label: "Health Blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const mounted = useMounted();
  const cartCount = useCartStore((s) =>
    mounted ? s.items.reduce((sum, i) => sum + i.quantity, 0) : 0
  );
  const wishlistCount = useWishlistStore((s) => (mounted ? s.items.length : 0));
  const compareCount = useCompareStore((s) => (mounted ? s.items.length : 0));
  const { user, isLoggedIn, logout } = useAuthStore();
  const loggedIn = mounted && isLoggedIn;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
      {/* Top announcement strip */}
      <div className="gradient-primary">
        <p className="container flex items-center justify-center gap-2 py-1.5 text-center text-xs font-medium text-white sm:text-[13px]">
          <Truck className="h-3.5 w-3.5" />
          Free delivery on orders above ₹499 · Genuine medicines, licensed pharmacy
        </p>
      </div>

      <div className="container flex h-16 items-center gap-3 lg:gap-6">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="mt-2">
              <Logo />
            </div>
            <nav className="mt-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                    pathname.startsWith(link.href) && "bg-accent text-primary"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/upload-prescription"
                className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                Upload Prescription
              </Link>
              <Link
                href="/track-order"
                className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                Track Order
              </Link>
              <Link
                href="/compare"
                className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                Compare Products {compareCount > 0 && `(${compareCount})`}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Logo className="shrink-0" />

        {/* Desktop search */}
        <div className="hidden flex-1 md:block md:max-w-xl lg:max-w-2xl">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <Link href="/upload-prescription" className="hidden xl:block">
            <Button variant="ghost" className="gap-2 text-sm">
              <FileUp className="h-4 w-4" />
              Upload Rx
            </Button>
          </Link>

          <ThemeToggle />

          <Link href="/compare" className="relative hidden sm:block">
            <Button variant="ghost" size="icon" aria-label={`Compare (${compareCount} items)`}>
              <GitCompareArrows className="h-5 w-5" />
            </Button>
            {compareCount > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                {compareCount}
              </Badge>
            )}
          </Link>

          <Link href="/account/wishlist" className="relative hidden sm:block">
            <Button variant="ghost" size="icon" aria-label={`Wishlist (${wishlistCount} items)`}>
              <Heart className="h-5 w-5" />
            </Button>
            {wishlistCount > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                {wishlistCount}
              </Badge>
            )}
          </Link>

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" aria-label={`Cart (${cartCount} items)`}>
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {cartCount > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                {cartCount}
              </Badge>
            )}
          </Link>

          {loggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-sm">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User /> My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders">
                    <Package /> My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/wishlist">
                    <Heart /> Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/notifications">
                    <Bell /> Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <LayoutDashboard /> Admin Panel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => logout()}
                >
                  <LogOut /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="ml-1">
              <Button size="sm" className="h-9">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="container pb-3 md:hidden">
        <SearchBar />
      </div>

      {/* Desktop category nav */}
      <nav className="hidden border-t lg:block">
        <div className="container flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname.startsWith(link.href) &&
                  "text-primary after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/track-order"
            className="ml-auto px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Track Order
          </Link>
        </div>
      </nav>
    </header>
  );
}
