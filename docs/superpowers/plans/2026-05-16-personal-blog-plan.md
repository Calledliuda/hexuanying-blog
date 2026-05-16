# Personal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a warm, restrained personal blog with Apple-style spring animations, horizontal book shelf, gallery, and PWA support.

**Architecture:** Next.js SSG static export with Tailwind CSS for styling and Framer Motion for animations. Content lives in Markdown + JSON files — no CMS, no database. Six single-page sections with scroll-triggered animations, plus individual post detail pages.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, Framer Motion 12, gray-matter, next-pwa

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/styles/globals.css`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd ~/Desktop/blog
npx create-next-app@latest . --typescript --tailwind --eslint --src-dir --app --no-import-alias --turbopack --use-npm
```

- [ ] **Step 2: Install additional dependencies**

```bash
npm install framer-motion gray-matter next-pwa
npm install --save-dev @types/node
```

Expected: All packages install without errors.

- [ ] **Step 3: Configure Tailwind with design tokens**

Write `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        warm: {
          DEFAULT: "#FAFAF9",
          50: "#FEFEFD",
          100: "#F5F5F2",
          200: "#EBEBE6",
          300: "#DCDCD3",
        },
        ink: {
          DEFAULT: "#1C1C1E",
          muted: "#6E6E73",
          light: "#AEAEB2",
        },
        accent: {
          blue: "#99B3C7",
          sage: "#A3B5A6",
          rose: "#C7A99B",
        },
      },
      fontFamily: {
        sans: [
          "PingFang SC",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        display: [
          "SF Pro Display",
          "PingFang SC",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: Write globals.css**

Write `src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-warm text-ink;
    font-feature-settings: "kern" 1, "liga" 1;
  }

  ::selection {
    @apply bg-accent-blue/30;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

- [ ] **Step 5: Configure Next.js with PWA support**

Write `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
};

export default nextConfig;
```

- [ ] **Step 6: Verify build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js with Tailwind design tokens"
```

---

### Task 2: Content Data Layer

**Files:**
- Create: `src/lib/posts.ts`
- Create: `src/lib/books.ts`
- Create: `content/posts/hello-world.md`
- Create: `content/posts/getting-started.md`
- Create: `content/books.json`

- [ ] **Step 1: Define Post type and Markdown parser**

Write `src/lib/posts.ts`:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover?: string;
  content: string;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? new Date().toISOString().split("T")[0],
        excerpt: data.excerpt ?? "",
        cover: data.cover ?? undefined,
        content,
      } as Post;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString().split("T")[0],
    excerpt: data.excerpt ?? "",
    cover: data.cover ?? undefined,
    content,
  };
}
```

- [ ] **Step 2: Create book data loader**

Write `src/lib/books.ts`:

```typescript
import booksData from "../../content/books.json";

export interface Book {
  title: string;
  author: string;
  cover: string;
  note: string;
}

export function getAllBooks(): Book[] {
  return booksData;
}
```

- [ ] **Step 3: Create sample blog posts**

Write `content/posts/hello-world.md`:

```markdown
---
title: "欢迎来到我的博客"
date: "2026-05-16"
excerpt: "这是一个新的开始，在这里记录我的思考和见闻。"
cover: "/fallback-cover.jpg"
---

这是我的个人博客。在这里，我会分享读书感受、旅行见闻，以及日常生活中的思考。

## 为什么要写博客？

写作是一种思考。把想法写下来，能帮助我理清思路，也更有可能发现新的连接。

## 你会在这里看到什么

- 对我读过的好书的推荐和感受
- 旅途中的照片和故事
- 日常生活的碎片和感悟

希望这里的内容能给你带来一些灵感。
```

Write `content/posts/getting-started.md`:

```markdown
---
title: "搭建这个博客的一些想法"
date: "2026-05-15"
excerpt: "关于为什么选择自己搭建博客，以及我对设计的思考。"
cover: "/fallback-cover.jpg"
---

## 为什么要自己搭建

现成的博客平台很多，但我想要完全的控制权。从配色到字体，从动画到排版，每一个细节都应该是我的选择。

## 设计理念

我喜欢 Apple 的设计哲学——大面积留白、克制的色彩、细腻的动画。不是炫技，而是让内容自然地被注意到。

好的设计是隐形的。
```

- [ ] **Step 4: Create sample book data**

Write `content/books.json`:

```json
[
  {
    "title": "思考，快与慢",
    "author": "丹尼尔·卡尼曼",
    "cover": "https://img2.doubanio.com/view/subject/l/public/s28332072.jpg",
    "note": "理解了系统1和系统2的运作方式后，我对自己的决策有了全新的认识。"
  },
  {
    "title": "设计中的设计",
    "author": "原研哉",
    "cover": "https://img1.doubanio.com/view/subject/l/public/s21658931.jpg",
    "note": "空白不是什么都没有，而是一种容纳可能性的容器。"
  },
  {
    "title": "禅与摩托车维修艺术",
    "author": "罗伯特·波西格",
    "cover": "https://img2.doubanio.com/view/subject/l/public/s1101233.jpg",
    "note": "关于质量的形而上学思考，骑行与哲思的完美融合。"
  },
  {
    "title": "人类简史",
    "author": "尤瓦尔·赫拉利",
    "cover": "https://img9.doubanio.com/view/subject/l/public/s27814883.jpg",
    "note": "从认知革命到科学革命，宏大叙事下的精彩洞见。"
  },
  {
    "title": "局外人",
    "author": "阿尔贝·加缪",
    "cover": "https://img2.doubanio.com/view/subject/l/public/s11110063.jpg",
    "note": "开篇第一句话就击中了我。存在主义的入门之作。"
  }
]
```

- [ ] **Step 5: Verify data loading**

```bash
node -e "const {getAllPosts} = require('./src/lib/posts'); console.log(getAllPosts());"
```

Expected: Array of 2 posts printed without errors. (May need `npx tsx` for TypeScript)

- [ ] **Step 6: Commit**

```bash
git add content/ src/lib/
git commit -m "feat: add content data layer with Markdown and JSON support"
```

---

### Task 3: Layout Component

**Files:**
- Create: `src/components/Layout.tsx`

- [ ] **Step 1: Write Layout component with navigation**

Write `src/components/Layout.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "关于", href: "#about" },
  { label: "文章", href: "#posts" },
  { label: "书目", href: "#books" },
  { label: "相册", href: "#gallery" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-warm">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-warm/80 backdrop-blur-xl border-b border-warm-200/60"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a
            href="#"
            className="text-lg font-semibold tracking-tight text-ink"
          >
            我的博客
          </a>
          <div className="hidden sm:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-ink-muted hover:text-ink transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="border-t border-warm-200 py-12 text-center">
        <p className="text-sm text-ink-muted">
          © {new Date().getFullYear()} · Built with care
        </p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify component compiles**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Layout.tsx
git commit -m "feat: add layout with scroll-aware navigation"
```

---

### Task 4: Hero Section

**Files:**
- Create: `src/components/HeroSection.tsx`

- [ ] **Step 1: Write HeroSection with staggered animation**

Write `src/components/HeroSection.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

interface HeroSectionProps {
  name: string;
  tagline: string;
  avatar?: string;
}

export default function HeroSection({ name, tagline, avatar }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-6">
      <div className="text-center">
        <motion.h1
          initial={{ filter: "blur(8px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-ink text-balance"
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0, 1] }}
          className="mt-6 text-xl sm:text-2xl text-ink-muted font-light text-balance"
        >
          {tagline}
        </motion.p>

        {avatar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.6,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="mt-16"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-2 ring-warm-200 shadow-sm">
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10"
      >
        <p className="text-xs text-ink-light tracking-widest uppercase">
          scroll
        </p>
        <div className="mt-2 mx-auto w-5 h-8 rounded-full border border-ink-light/30 flex justify-center pt-1">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-ink-light/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: add hero section with blur text animation"
```

---

### Task 5: About Section

**Files:**
- Create: `src/components/AboutSection.tsx`

- [ ] **Step 1: Write AboutSection with scroll-triggered fade**

Write `src/components/AboutSection.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AboutSectionProps {
  bio: string;
}

export default function AboutSection({ bio }: AboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30%" });

  return (
    <section id="about" ref={ref} className="py-32 sm:py-40 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
        className="max-w-2xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xs tracking-widest uppercase text-ink-light mb-8"
        >
          关于我
        </motion.p>

        <p className="text-lg sm:text-xl leading-relaxed text-ink text-balance">
          {bio}
        </p>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/AboutSection.tsx
git commit -m "feat: add about section with scroll-triggered animation"
```

---

### Task 6: Post Card & Featured Posts

**Files:**
- Create: `src/components/PostCard.tsx`
- Create: `src/components/FeaturedPosts.tsx`

- [ ] **Step 1: Write PostCard with stagger support**

Write `src/components/PostCard.tsx`:

```tsx
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

export default function PostCard({ slug, title, date, excerpt, cover, ...motionProps }: PostCardProps) {
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
```

- [ ] **Step 2: Write FeaturedPosts with stagger animation**

Write `src/components/FeaturedPosts.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-widest uppercase text-ink-light mb-12"
        >
          文章
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {posts.slice(0, 3).map((post, i) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              date={post.date}
              excerpt={post.excerpt}
              cover={post.cover ?? "/fallback-cover.jpg"}
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
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/PostCard.tsx src/components/FeaturedPosts.tsx
git commit -m "feat: add post card grid with stagger animation"
```

---

### Task 7: Book Card & Book Shelf

**Files:**
- Create: `src/components/BookCard.tsx`
- Create: `src/components/BookShelf.tsx`

- [ ] **Step 1: Write BookCard**

Write `src/components/BookCard.tsx`:

```tsx
import { motion } from "framer-motion";
import type { Book } from "@/lib/books";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="flex-shrink-0 w-44 sm:w-52 cursor-grab active:cursor-grabbing select-none"
    >
      <div className="aspect-[3/4] overflow-hidden rounded-lg bg-warm-100 shadow-sm">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover pointer-events-none"
          loading="lazy"
        />
      </div>
      <h4 className="mt-3 text-sm font-medium text-ink truncate">
        {book.title}
      </h4>
      <p className="text-xs text-ink-muted mt-0.5">{book.author}</p>
      <p className="text-xs text-ink-muted mt-1.5 leading-relaxed line-clamp-2 italic">
        &ldquo;{book.note}&rdquo;
      </p>
    </motion.div>
  );
}
```

- [ ] **Step 2: Write BookShelf with horizontal drag**

Write `src/components/BookShelf.tsx`:

```tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import BookCard from "./BookCard";
import type { Book } from "@/lib/books";

interface BookShelfProps {
  books: Book[];
}

export default function BookShelf({ books }: BookShelfProps) {
  const ref = useRef(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const [carouselWidth, setCarouselWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      const w = carouselRef.current.scrollWidth - carouselRef.current.offsetWidth;
      setCarouselWidth(w > 0 ? w : 0);
    }
  }, [books]);

  if (books.length === 0) return null;

  return (
    <section id="books" ref={ref} className="py-32 sm:py-40 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-widest uppercase text-ink-light mb-12"
        >
          推荐书目
        </motion.p>

        <motion.div
          ref={carouselRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0, 1] }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -carouselWidth }}
            dragElastic={0.05}
            dragMomentum
            className="flex gap-6 cursor-grab active:cursor-grabbing pb-4"
            style={{ touchAction: "pan-y" }}
          >
            {books.map((book, i) => (
              <BookCard key={`${book.title}-${i}`} book={book} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/BookCard.tsx src/components/BookShelf.tsx
git commit -m "feat: add horizontal book shelf with drag momentum"
```

---

### Task 8: Gallery Component

**Files:**
- Create: `src/components/Gallery.tsx`

- [ ] **Step 1: Write Gallery with hover effects**

Write `src/components/Gallery.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const galleryImages = [
  "/gallery/1.jpg",
  "/gallery/2.jpg",
  "/gallery/3.jpg",
];

interface GalleryProps {
  images?: string[];
}

export default function Gallery({ images = galleryImages }: GalleryProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  if (images.length === 0) return null;

  return (
    <section id="gallery" ref={ref} className="py-32 sm:py-40 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-widest uppercase text-ink-light mb-12"
        >
          见闻
        </motion.p>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.1 * i,
                ease: [0.25, 0.1, 0, 1],
              }}
              whileHover={{ scale: 1.02 }}
              className="overflow-hidden rounded-xl bg-warm-100 break-inside-avoid"
            >
              <img
                src={src}
                alt=""
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create gallery placeholder directory**

```bash
mkdir -p public/gallery
# Create a placeholder for development
echo "placeholder" > public/gallery/.gitkeep
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Gallery.tsx public/gallery/.gitkeep
git commit -m "feat: add masonry gallery with hover effects"
```

---

### Task 9: Homepage Assembly

**Files:**
- Write: `src/app/page.tsx`
- Create: `public/fallback-cover.jpg` (placeholder)
- Create: `public/favicon.ico`

- [ ] **Step 1: Write the homepage with all sections**

Write `src/app/page.tsx`:

```tsx
import { getAllPosts } from "@/lib/posts";
import { getAllBooks } from "@/lib/books";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturedPosts from "@/components/FeaturedPosts";
import BookShelf from "@/components/BookShelf";
import Gallery from "@/components/Gallery";

export const dynamic = "force-static";

export default function HomePage() {
  const posts = getAllPosts();
  const books = getAllBooks();

  return (
    <Layout>
      <HeroSection
        name="我的博客"
        tagline="记录思考、阅读与旅途中的见闻"
        avatar="/avatar.jpg"
      />

      <AboutSection bio="你好，我是[你的名字]。一个热爱阅读、旅行和思考的人。这个博客是我与世界分享想法的地方。在这里，没有算法推荐、没有流量焦虑，只有真诚的记录。" />

      <FeaturedPosts posts={posts} />

      <BookShelf books={books} />

      <Gallery />
    </Layout>
  );
}
```

- [ ] **Step 2: Create a simple fallback cover image**

```bash
# Create an SVG as fallback
echo '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect fill="#F5F5F2" width="800" height="450"/><text fill="#AEAEB2" font-family="system-ui" font-size="14" text-anchor="middle" x="400" y="230">封面图片</text></svg>' > public/fallback-cover.svg
```

- [ ] **Step 3: Create a simple favicon SVG**

```bash
echo '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect fill="#1C1C1E" width="32" height="32" rx="6"/><text fill="#FAFAF9" font-family="system-ui" font-size="18" font-weight="bold" text-anchor="middle" y="23" x="16">B</text></svg>' > public/favicon.svg
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Open http://localhost:3000. Expected: Warm white background, hero with text animation, scroll down to see all sections.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx public/fallback-cover.svg public/favicon.svg
git commit -m "feat: assemble homepage with all sections"
```

---

### Task 10: Post Detail Page

**Files:**
- Create: `src/app/posts/[slug]/page.tsx`

- [ ] **Step 1: Write post detail page**

Write `src/app/posts/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export const dynamic = "force-static";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="stroke-current"
          >
            <path
              d="M10 3L5 8l5 5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          返回
        </Link>

        <time className="text-xs text-ink-muted tracking-wider uppercase">
          {post.date}
        </time>

        <h1 className="mt-4 text-3xl sm:text-4xl font-display font-bold tracking-tight text-ink text-balance">
          {post.title}
        </h1>

        <div className="mt-12 prose prose-lg prose-ink max-w-none">
          {post.content.split("\n").map((paragraph, i) => {
            if (!paragraph.trim()) return null;

            if (paragraph.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="mt-12 mb-4 text-xl font-semibold text-ink"
                >
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }

            return (
              <p
                key={i}
                className="mt-4 text-lg leading-relaxed text-ink/85"
              >
                {paragraph}
              </p>
            );
          })}
        </div>
      </article>
    </div>
  );
}
```

- [ ] **Step 2: Verify build with static generation**

```bash
npm run build
```

Expected: Build succeeds. Look for `[slug]` routes generated in the output.

- [ ] **Step 3: Verify post navigation**

```bash
npm run dev
```

Open http://localhost:3000, click a post card. Expected: Navigate to detail page with proper rendering. Click "返回" to go back.

- [ ] **Step 4: Commit**

```bash
git add src/app/posts/
git commit -m "feat: add SSG post detail page"
```

---

### Task 11: PWA Configuration

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `public/manifest.json`
- Create: `public/sw.js`

- [ ] **Step 1: Add PWA meta tags and manifest link**

Modify `src/app/layout.tsx` — add to `<head>`:

```tsx
import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "我的博客",
  description: "记录思考、阅读与旅途中的见闻",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAF9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="我的博客" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Write PWA manifest**

Write `public/manifest.json`:

```json
{
  "name": "我的博客",
  "short_name": "博客",
  "description": "记录思考、阅读与旅途中的见闻",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAFAF9",
  "theme_color": "#FAFAF9",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

- [ ] **Step 3: Write simple service worker**

Write `public/sw.js`:

```javascript
const CACHE = "blog-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(["/", "/manifest.json"]))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
```

- [ ] **Step 4: Verify build and PWA validation**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx public/manifest.json public/sw.js
git commit -m "feat: add PWA support with service worker"
```

---

### Task 12: Polish & Final Verification

**Files:**
- Check all components render correctly
- Verify responsive behavior
- Test animations

- [ ] **Step 1: Run dev server and verify all sections**

```bash
npm run dev
```

Check:
- Hero animation plays on load (blur → clear, avatar pops in)
- Scroll down triggers fade-in for each section
- Post cards stagger in
- Book shelf drags horizontally with momentum
- Gallery hover effects work
- Post detail page navigation works
- Responsive at mobile (< 640px), tablet (640-1024px), desktop (> 1024px)

- [ ] **Step 2: Run production build**

```bash
npm run build && npm run start
```

Expected: Production build succeeds with all pages pre-rendered.

- [ ] **Step 3: Add PWA service worker registration**

Add to `public/sw-register.js`:

```javascript
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
```

And add `<script src="/sw-register.js" />` to `layout.tsx` body.

- [ ] **Step 4: Final commit**

```bash
git add public/sw-register.js src/app/layout.tsx
git commit -m "chore: register service worker, final polish"
```

---

### Task 13: Initialize Git & Deploy

- [ ] **Step 1: Initialize git repository**

```bash
cd ~/Desktop/blog
git init
```

- [ ] **Step 2: Add .gitignore**

```bash
echo 'node_modules/\n.next/\nout/\n.env*\n' > .gitignore
```

- [ ] **Step 3: Create GitHub repository and push**

```bash
git add -A
git commit -m "feat: complete personal blog with Apple-style design"
```

Create a new repo on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/blog.git
git branch -M main
git push -u origin main
```

- [ ] **Step 4: Deploy to Vercel**

Go to https://vercel.com/new, import the GitHub repo. Vercel detects Next.js automatically. Deploy.

- [ ] **Step 5: Install as App**

On iPhone/iPad: Open deployed URL in Safari → Share → "Add to Home Screen"
On Mac: Open in Safari → File → "Add to Dock"

- [ ] **Step 6: Commit**

```bash
git add .gitignore
git commit -m "chore: add gitignore"
```
