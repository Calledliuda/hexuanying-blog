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
        <p className="text-xs tracking-widest uppercase text-ink-light mb-8">
          关于我
        </p>
        <p className="text-lg sm:text-xl leading-relaxed text-ink text-balance">
          {bio}
        </p>
      </motion.div>
    </section>
  );
}
