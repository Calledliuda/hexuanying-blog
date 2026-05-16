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
          className="text-5xl sm:text-6xl lg:text-7xl font-[family-name:var(--font-display)] font-bold tracking-tight text-ink text-balance"
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
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-2 ring-warm-200 shadow-sm mx-auto">
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
