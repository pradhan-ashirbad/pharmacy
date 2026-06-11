"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { SectionHeader } from "@/components/shared/section-header";
import { categories } from "@/data/categories";
import { iconMap, tintStyles } from "@/lib/visuals";
import { cn } from "@/lib/utils";

export function CategoriesSection() {
  return (
    <section className="container py-12 sm:py-16">
      <SectionHeader
        title="Shop by Category"
        subtitle="Everything your family's health needs, in one place"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {categories.map((category, i) => {
          const Icon = iconMap[category.icon];
          const tint = tintStyles[category.tint];
          return (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <Link
                href={category.href}
                className="group flex h-full flex-col rounded-2xl border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                    tint.chip
                  )}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <h3 className="mt-4 text-sm font-semibold leading-snug">
                  {category.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {category.description}
                </p>
                <p className="mt-auto pt-3 text-xs font-medium text-primary">
                  {category.productCount} products →
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
