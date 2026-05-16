import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-warm">
      <article className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        <Link
          href="/#posts"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors mb-12"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current">
            <path d="M10 3L5 8l5 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          返回
        </Link>

        <time className="text-xs text-ink-muted tracking-wider uppercase">
          {post.date}
        </time>

        <h1 className="mt-4 text-3xl sm:text-4xl font-[family-name:var(--font-display)] font-bold tracking-tight text-ink text-balance">
          {post.title}
        </h1>

        <div className="mt-12 max-w-none">
          {post.content.split("\n").map((line, i) => {
            if (!line.trim()) return <div key={i} className="h-4" />;
            if (line.startsWith("## ")) {
              return (
                <h2 key={i} className="mt-12 mb-4 text-xl font-semibold text-ink">
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <li key={i} className="ml-4 mt-2 text-lg leading-relaxed text-ink/85">
                  {line.replace("- ", "")}
                </li>
              );
            }
            return (
              <p key={i} className="mt-4 text-lg leading-relaxed text-ink/85">
                {line}
              </p>
            );
          })}
        </div>
      </article>
    </div>
  );
}
