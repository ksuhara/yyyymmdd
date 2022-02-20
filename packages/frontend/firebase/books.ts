import { collection, getDocs, getFirestore } from "firebase/firestore";
import { createFirebaseApp } from "./clientApp";

export type Book = {
  id: string;
  tokenId: number;
  title: string;
  content: string;
  walletAddress: string;
};

export async function getBooks(): Promise<Book[]> {
  createFirebaseApp();
  const books = new Array<Book>();
  const db = getFirestore();
  const booksSnapshot = await getDocs(collection(db, "/books"));

  booksSnapshot.forEach((doc) => {
    const book = doc.data() as Book;
    books.push({ ...book, id: doc.id });
  });

  return books;
}
