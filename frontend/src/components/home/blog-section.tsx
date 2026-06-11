import Link from "next/link";
import { Clock } from "lucide-react";

import { SectionHeader } from "@/components/shared/section-header";
import { blogPosts } from "@/data/blog";
import { iconMap, tintStyles } from "@/lib/visuals";
import { cn, formatDate } from "@/lib/utils";

export function BlogSection() {
  const posts = blogPosts.slice(0, 3);
  return (
    <section className="container py-12 sm:py-16">
      <SectionHeader
        title="Health Tips & Articles"
        subtitle="Expert-written guides to help you live healthier"
        href="/blog"
        linkLabel="Read all articles"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => {
          const Icon = iconMap[post.icon];
          const tint = tintStyles[post.tint];
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <div
                className={cn(
                  "relative flex h-40 items-center justify-center",
                  tint.surface
                )}
              >
                <Icon
                  className={cn("h-14 w-14 transition-transform group-hover:scale-110", tint.text)}
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
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
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
    </section>
  );
}
