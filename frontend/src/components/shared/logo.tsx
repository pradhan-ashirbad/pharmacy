import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2", className)}
      aria-label="MediKart — home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-soft">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-white"
          aria-hidden="true"
        >
          <path
            d="M12 4v16M4 12h16"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="font-display text-xl font-bold tracking-tight">
        Medi<span className="text-gradient">Kart</span>
      </span>
    </Link>
  );
}
