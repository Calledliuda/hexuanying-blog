"use client";

import { motion } from "framer-motion";

interface HeroSectionProps {
  name: string;
  tagline: string;
  avatar?: string;
}

export default function HeroSection({ name, tagline, avatar }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center relative px-6">
      <div className="flex flex-col sm:flex-row items-center gap-10 sm:gap-16 lg:gap-24 max-w-3xl mx-auto">
        {avatar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-accent-amber/15 blur-2xl scale-150" />
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-1 ring-warm-300/50 shadow-sm relative">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div className="text-center sm:text-left">
          <motion.h1
            initial={{ filter: "blur(8px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-[family-name:var(--font-display)] font-bold tracking-tight text-ink text-balance"
          >
            {name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0, 1] }}
            className="mt-4 text-lg sm:text-xl text-ink-muted font-light text-balance"
          >
            {tagline}
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10"
      >
        <p className="text-xs text-ink-light tracking-widest uppercase text-center">
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
