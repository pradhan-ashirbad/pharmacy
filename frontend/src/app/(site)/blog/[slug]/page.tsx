import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronLeft, Clock } from "lucide-react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { blogPosts, getBlogPostBySlug } from "@/data/blog";
import { iconMap, tintStyles } from "@/lib/visuals";
import { cn, formatDate } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const Icon = iconMap[post.icon];
  const tint = tintStyles[post.tint];
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="container max-w-3xl py-10">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.category }]} />

      <div className={cn("flex h-48 items-center justify-center rounded-3xl sm:h-56", tint.surface)}>
        <Icon className={cn("h-20 w-20", tint.text)} strokeWidth={1.1} />
      </div>

      <span className={cn("mt-6 inline-block rounded-full px-3 py-1 text-xs font-semibold", tint.chip)}>
        {post.category}
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-sm">
              {post.author
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{post.author}</p>
            <p className="text-xs text-muted-foreground">{post.authorRole}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(post.publishedOn)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readMinutes} min read
          </span>
        </div>
      </div>

      <Separator className="my-7" />

      <div className="space-y-5">
        {post.content.map((paragraph, i) => (
          <p key={i} className="leading-relaxed text-foreground/90">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border bg-muted/40 p-5 text-sm text-muted-foreground">
        This article is for general awareness and does not replace professional
        medical advice. Always consult a qualified doctor for diagnosis and
        treatment.
      </div>

      <Separator className="my-10" />

      <h2 className="font-display text-xl font-bold">Keep Reading</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {related.map((p) => {
          const RIcon = iconMap[p.icon];
          const rTint = tintStyles[p.tint];
          return (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-xl", rTint.chip)}>
                <RIcon className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <div>
                <p className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                  {p.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.readMinutes} min read
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        href="/blog"
        className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to all articles
      </Link>
    </article>
  );
}
