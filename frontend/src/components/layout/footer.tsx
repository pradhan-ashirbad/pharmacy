import Link from "next/link";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Twitter,
  Undo2,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "100% Genuine",
    description: "Sourced from licensed distributors",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Express delivery in 19,000+ pincodes",
  },
  {
    icon: Undo2,
    title: "Easy Returns",
    description: "7-day hassle-free return policy",
  },
  {
    icon: Clock,
    title: "24×7 Support",
    description: "Pharmacists available round the clock",
  },
];

const footerLinks: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Shop",
    links: [
      { label: "Medicines", href: "/medicines" },
      { label: "Wellness Store", href: "/wellness" },
      { label: "Health Devices", href: "/health-devices" },
      { label: "Offers & Coupons", href: "/offers" },
      { label: "Compare Products", href: "/compare" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Upload Prescription", href: "/upload-prescription" },
      { label: "Track Order", href: "/track-order" },
      { label: "My Account", href: "/account" },
      { label: "Admin Panel", href: "/admin" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About MediKart", href: "/#about" },
      { label: "Careers", href: "/#careers" },
      { label: "Privacy Policy", href: "/#privacy" },
      { label: "Terms of Service", href: "/#terms" },
      { label: "Return Policy", href: "/#returns" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-muted/40">
      {/* Trust strip */}
      <div className="container grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
        {trustPoints.map((point) => (
          <div key={point.title} className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
              <point.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{point.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {point.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t">
        <div className="container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              MediKart is India&apos;s modern online pharmacy — genuine medicines,
              wellness essentials and health devices delivered to your doorstep,
              backed by licensed pharmacists.
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary" /> 1800-120-1234 (toll free)
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary" /> care@medikart.in
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary" /> Bengaluru, Karnataka, India
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {group.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© 2026 MediKart Health Pvt Ltd. All rights reserved.</p>
          <p>
            Medicines are dispensed against valid prescriptions by our partner
            licensed pharmacies. DL No: KA-B12-345678
          </p>
        </div>
      </div>
    </footer>
  );
}
