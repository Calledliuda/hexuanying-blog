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
