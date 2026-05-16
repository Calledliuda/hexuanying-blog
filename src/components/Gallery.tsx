"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface GalleryProps {
  images?: string[];
}

const defaultImages = [
  "/gallery/1.jpg",
  "/gallery/2.jpg",
  "/gallery/3.jpg",
];

export default function Gallery({ images = defaultImages }: GalleryProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  if (images.length === 0) return null;

  return (
    <section id="gallery" ref={ref} className="py-32 sm:py-40 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-ink-light mb-12">
          见闻
        </p>
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
              className="overflow-hidden rounded-xl bg-warm-100"
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
