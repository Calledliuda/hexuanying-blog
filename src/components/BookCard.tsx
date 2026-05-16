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
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
      </div>
      <h4 className="mt-3 text-sm font-medium text-ink truncate">
        {book.title}
      </h4>
      <p className="text-xs text-ink-muted mt-0.5">{book.author}</p>
      <p className="text-xs text-ink-muted mt-1.5 leading-relaxed line-clamp-2">
        &ldquo;{book.note}&rdquo;
      </p>
    </motion.div>
  );
}
