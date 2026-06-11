import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";

import { blogPosts } from "@/data/blog";
import { iconMap, tintStyles } from "@/lib/visuals";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Health Blog — Tips & Articles by Experts",
  description:
    "Expert-written articles on immunity, diabetes, heart health, nutrition and home healthcare for Indian families.",
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;
  const FeaturedIcon = iconMap[featured.icon];
  const featuredTint = tintStyles[featured.tint];

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Health <span className="text-gradient">Blog</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Practical, expert-reviewed health guidance for Indian families.
        </p>
      </div>

      {/* Featured article */}
      <Link
        href={`/blog/${featured.slug}`}
        className="group mt-10 grid overflow-hidden rounded-3xl border bg-card shadow-soft transition-shadow hover:shadow-card md:grid-cols-2"
      >
        <div
          className={cn(
            "flex min-h-56 items-center justify-center",
            featuredTint.surface
          )}
        >
          <FeaturedIcon
            className={cn(
              "h-24 w-24 transition-transform group-hover:scale-110",
              featuredTint.text
            )}
            strokeWidth={1.1}
          />
        </div>
        <div className="flex flex-col p-7 sm:p-9">
          <span
            className={cn(
              "w-fit rounded-full px-3 py-1 text-xs font-semibold",
              featuredTint.chip
            )}
          >
            {featured.category}
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold leading-snug transition-colors group-hover:text-primary">
            {featured.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
          <div className="mt-auto flex items-center gap-3 pt-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{featured.author}</span>
            <span>·</span>
            <span>{formatDate(featured.publishedOn)}</span>
            <span className="ml-auto inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {featured.readMinutes} min read
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => {
          const Icon = iconMap[post.icon];
          const tint = tintStyles[post.tint];
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <div className={cn("relative flex h-36 items-center justify-center", tint.surface)}>
                <Icon
                  className={cn("h-12 w-12 transition-transform group-hover:scale-110", tint.text)}
                  strokeWidth={1.3}
                />
                <span
                  className={cn(
                    "absolute left-4 top-4 rounded-full px-2.5 py-1 text-xs font-semibold",
                    tint.chip
                  )}
                >
                  {post.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{post.author}</span>
                  <span>·</span>
                  <span>{formatDate(post.publishedOn)}</span>
                  <span className="ml-auto inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readMinutes} min
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
