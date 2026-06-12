"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  HeartPulse,
  Pill,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { SearchBar } from "@/components/layout/search-bar";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { label: "Medicines", href: "/medicines", icon: Pill },
  { label: "Wellness", href: "/wellness", icon: Sparkles },
  { label: "Health Gadgets", href: "/health-devices", icon: Activity },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.5, ease: "easeOut" },
  }),
};

export function Hero() {
  return (
    <section className="gradient-hero relative overflow-hidden">
      {/* decorative background orbs */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-xs font-medium shadow-soft backdrop-blur sm:text-sm"
          >
            <ShieldCheck className="h-4 w-4 text-secondary" />
            Trusted by 1 crore+ Indian families
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Your health,
            <br />
            delivered with <span className="text-gradient">care</span>.
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg"
          >
            Genuine medicines, wellness products and smart health gadgets —
            verified by licensed pharmacists and delivered to your doorstep.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-7 max-w-xl"
          >
            <SearchBar />
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-5 flex flex-wrap items-center gap-2.5"
          >
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background/70 px-4 py-2 text-sm font-medium shadow-soft backdrop-blur transition-all hover:border-primary hover:text-primary"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </motion.div>

          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button asChild size="lg" variant="gradient" className="group">
              <Link href="/medicines">
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/upload-prescription">Upload Prescription</Link>
            </Button>
          </motion.div>
        </div>

        {/* Illustration: floating health cards */}
        <div className="relative mx-auto hidden h-[420px] w-full max-w-md lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-8 rounded-[3rem] gradient-primary opacity-90"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55 }}
            className="absolute left-0 top-12 w-56 animate-float rounded-2xl border bg-background/95 p-4 shadow-lifted backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                <HeartPulse className="h-5 w-5 text-rose-500" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Heart Rate</p>
                <p className="text-lg font-bold">
                  72 <span className="text-xs font-medium text-muted-foreground">bpm</span>
                </p>
              </div>
            </div>
            <div className="mt-3 flex h-8 items-end gap-1">
              {[40, 70, 45, 90, 55, 75, 50, 85, 60, 70, 45, 80].map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="w-2 rounded-full bg-rose-300/80"
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.55 }}
            className="absolute right-0 top-36 w-52 rounded-2xl border bg-background/95 p-4 shadow-lifted backdrop-blur [animation-delay:1.2s]"
            style={{ animationName: "float" }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <Truck className="h-5 w-5 text-emerald-600" />
              </span>
              <div>
                <p className="text-sm font-semibold">Order Delivered</p>
                <p className="text-xs text-muted-foreground">In under 24 hours</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.55 }}
            className="absolute bottom-10 left-8 w-60 animate-float rounded-2xl border bg-background/95 p-4 shadow-lifted backdrop-blur [animation-delay:0.6s]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                  <Pill className="h-5 w-5 text-sky-600" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Dolo 650</p>
                  <p className="text-xs text-muted-foreground">₹28 · 15 tablets</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-0.5 rounded-md bg-success/10 px-1.5 py-0.5 text-xs font-semibold text-success">
                4.7 <Star className="h-3 w-3 fill-current" />
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
