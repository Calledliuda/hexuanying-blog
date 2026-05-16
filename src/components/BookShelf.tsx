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
      setCarouselWidth(
        Math.max(0, carouselRef.current.scrollWidth - carouselRef.current.offsetWidth),
      );
    }
  }, [books]);

  if (books.length === 0) return null;

  return (
    <section id="books" ref={ref} className="py-32 sm:py-40 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-ink-light mb-12">
          推荐书目
        </p>
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
