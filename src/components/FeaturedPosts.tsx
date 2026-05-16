"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { asset } from "@/lib/path";
import PostCard from "./PostCard";
import type { Post } from "@/lib/posts";

interface FeaturedPostsProps {
  posts: Post[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  if (posts.length === 0) return null;

  return (
    <section id="posts" ref={ref} className="py-32 sm:py-40 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-ink-light mb-12">
          文章
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {posts.slice(0, 3).map((post, i) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              date={post.date}
              excerpt={post.excerpt}
              cover={post.cover ? (post.cover.startsWith("http") ? post.cover : asset(post.cover)) : asset("/fallback-cover.svg")}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15 * i,
                ease: [0.25, 0.1, 0, 1],
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
