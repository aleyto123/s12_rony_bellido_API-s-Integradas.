import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type BookStats = {
  id: string;
  title: string;
  publishedYear: number | null;
  pages: number | null;
  genre: string | null;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Autor no encontrado' },
        { status: 404 }
      );
    }

    const books: BookStats[] = author.books as BookStats[];

    if (!books.length) {
      return NextResponse.json({
        authorId: author.id,
        authorName: author.name,
        totalBooks: 0,
        firstBook: null,
        latestBook: null,
        averagePages: 0,
        genres: [],
        longestBook: null,
        shortestBook: null,
      });
    }

    const years = books
      .filter((book) => book.publishedYear)
      .map((book) => Number(book.publishedYear));

    const pages = books
      .filter((book) => typeof book.pages === 'number')
      .map((book) => Number(book.pages));

    const uniqueGenres = [...new Set(books.filter((book) => book.genre).map((book) => book.genre as string))];

    const longestBook = books.reduce((prev: BookStats, current: BookStats) => {
      const prevPages = Number(prev.pages ?? 0);
      const currentPages = Number(current.pages ?? 0);
      return currentPages > prevPages ? current : prev;
    });

    const shortestBook = books.reduce((prev: BookStats, current: BookStats) => {
      const prevPages = Number(prev.pages ?? Number.MAX_SAFE_INTEGER);
      const currentPages = Number(current.pages ?? Number.MAX_SAFE_INTEGER);
      return currentPages < prevPages ? current : prev;
    });

    const firstBook = books
      .filter((book) => book.publishedYear)
      .sort((a, b) => Number(a.publishedYear) - Number(b.publishedYear))[0];

    const latestBook = books
      .filter((book) => book.publishedYear)
      .sort((a, b) => Number(b.publishedYear) - Number(a.publishedYear))[0];

    return NextResponse.json({
      authorId: author.id,
      authorName: author.name,
      totalBooks: books.length,
      firstBook: firstBook
        ? { title: firstBook.title, year: Number(firstBook.publishedYear) }
        : null,
      latestBook: latestBook
        ? { title: latestBook.title, year: Number(latestBook.publishedYear) }
        : null,
      averagePages: pages.length ? Math.round(pages.reduce((sum: number, page: number) => sum + page, 0) / pages.length) : 0,
      genres: uniqueGenres,
      longestBook: longestBook && longestBook.pages
        ? { title: longestBook.title, pages: Number(longestBook.pages) }
        : null,
      shortestBook: shortestBook && shortestBook.pages
        ? { title: shortestBook.title, pages: Number(shortestBook.pages) }
        : null,
      years,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas del autor' },
      { status: 500 }
    );
  }
}
