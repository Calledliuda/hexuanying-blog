"use client";

import { useEffect, useState } from "react";

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
          <a href="#" className="text-lg font-semibold tracking-tight text-ink">
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
          &copy; {new Date().getFullYear()} &middot; Built with care
        </p>
      </footer>
    </div>
  );
}
