"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { SectionHeader } from "@/components/shared/section-header";
import { healthConcerns } from "@/data/categories";
import { iconMap, tintStyles } from "@/lib/visuals";
import { cn } from "@/lib/utils";

export function HealthConcernsSection() {
  return (
    <section className="bg-muted/40 py-12 sm:py-16">
      <div className="container">
        <SectionHeader
          title="Shop by Health Concern"
          subtitle="Curated products for the conditions that matter to you"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {healthConcerns.map((concern, i) => {
            const Icon = iconMap[concern.icon];
            const tint = tintStyles[concern.tint];
            return (
              <motion.div
                key={concern.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  href={`/health-concerns/${concern.slug}`}
                  className="group flex h-full items-start gap-4 rounded-2xl border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
                >
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                      tint.chip
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="flex items-center gap-1 text-sm font-semibold">
                      {concern.name}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {concern.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
