import { HeartPulse, ShieldCheck, Truck } from "lucide-react";

import { Logo } from "@/components/shared/logo";

/**
 * Two-panel auth layout: brand panel on desktop, form card always.
 */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container grid min-h-[70vh] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="hidden lg:block">
        <Logo />
        <h1 className="mt-8 font-display text-4xl font-bold leading-tight tracking-tight">
          Healthcare that&apos;s
          <br />
          always <span className="text-gradient">within reach</span>.
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Join over 1 crore Indians who order medicines, wellness products and
          health devices on MediKart.
        </p>
        <ul className="mt-8 space-y-4">
          {[
            { icon: ShieldCheck, text: "100% genuine products from licensed pharmacies" },
            { icon: Truck, text: "Free delivery on orders above ₹499" },
            { icon: HeartPulse, text: "24×7 pharmacist support for your family" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
                <Icon className="h-4.5 w-4.5 h-[18px] w-[18px] text-primary" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border bg-card p-6 shadow-card sm:p-8">
          <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
