"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";

interface PostCardProps extends HTMLMotionProps<"article"> {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: string;
}

export default function PostCard({
  slug, title, date, excerpt, cover, ...motionProps
}: PostCardProps) {
  return (
    <motion.article {...motionProps}>
      <Link href={`/posts/${slug}`} className="group block">
        <div className="aspect-[16/10] overflow-hidden rounded-xl bg-warm-100 mb-5">
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <time className="text-xs text-ink-muted tracking-wider uppercase">
          {date}
        </time>
        <h3 className="mt-2 text-xl font-semibold text-ink group-hover:text-ink/80 transition-colors text-balance">
          {title}
        </h3>
        <p className="mt-2 text-sm text-ink-muted leading-relaxed line-clamp-2">
          {excerpt}
        </p>
      </Link>
    </motion.article>
  );
}
