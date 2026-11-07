"use client";

import { useEffect, useMemo, useState } from 'react';

type Author = {
  id: string;
  name: string;
};

type Book = {
  id: string;
  title: string;
  genre?: string | null;
  publishedYear?: number | null;
  pages?: number | null;
  author: Author;
};

export default function BooksPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    isbn: '',
    publishedYear: '',
    genre: '',
    pages: '',
    authorId: '',
  });

  const uniqueGenres = useMemo(() => {
    const values = new Set(books.map((book) => book.genre).filter(Boolean) as string[]);
    return Array.from(values);
  }, [books]);

  const loadAuthors = async () => {
    const res = await fetch('/api/authors');
    const data = await res.json();
    setAuthors(data);
  };

  const loadBooks = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '10',
      sortBy,
      order,
    });

    if (search) params.set('search', search);
    if (genre) params.set('genre', genre);
    if (authorName) params.set('authorName', authorName);

    const res = await fetch(`/api/books/search?${params.toString()}`);
    const data = await res.json();
    setBooks(data.data ?? []);
    setTotalPages(data.pagination?.totalPages ?? 1);
    setLoading(false);
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  useEffect(() => {
    loadBooks();
  }, [page, sortBy, order, search, genre, authorName]);

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : null,
        pages: form.pages ? Number(form.pages) : null,
      }),
    });

    if (response.ok) {
      setForm({
        title: '',
        description: '',
        isbn: '',
        publishedYear: '',
        genre: '',
        pages: '',
        authorId: '',
      });
      loadBooks();
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
    loadBooks();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10 text-white">
      <div className="mb-8 rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Catálogo</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Búsqueda y gestión de libros</h1>
          </div>
          <a href="/" className="rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm font-medium hover:border-slate-500">
            Volver al inicio
          </a>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <form onSubmit={handleCreateBook} className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-soft">
          <h2 className="mb-5 text-xl font-bold">Agregar libro</h2>
          <div className="space-y-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Descripción" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3" />
            <input value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} placeholder="ISBN" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3" />
            <div className="grid gap-4 md:grid-cols-2">
              <input value={form.publishedYear} onChange={(e) => setForm({ ...form, publishedYear: e.target.value })} placeholder="Año" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3" />
              <input value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} placeholder="Páginas" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3" />
            </div>
            <input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} placeholder="Género" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3" />
            <select value={form.authorId} onChange={(e) => setForm({ ...form, authorId: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3">
              <option value="">Selecciona autor</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
        <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row">
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por título" className="flex-1 rounded-xl border border-slate-700 bg-slate-950 p-3" />
            <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }} className="rounded-xl border border-slate-700 bg-slate-950 p-3">
              <option value="">Todos los géneros</option>
              {uniqueGenres.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <select value={authorId} onChange={(e) => { setAuthorId(e.target.value); setPage(1); }} className="rounded-xl border border-slate-700 bg-slate-950 p-3">
              <option value="">Todos los autores</option>
              {authors.map((author) => (
                <option key={author.id} value={author.name}>{author.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 p-3">
                <option value="createdAt">Fecha</option>
                <option value="title">Título</option>
                <option value="publishedYear">Año</option>
              </select>
              <select value={order} onChange={(e) => setOrder(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 p-3">
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
            <div className="text-sm text-slate-300">{books.length} resultados</div>
          </div>

          {loading ? (
            <div className="py-10 text-center text-slate-300">Cargando libros...</div>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <div key={book.id} className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{book.title}</h3>
                      <p className="mt-1 text-sm text-slate-300">{book.author?.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg border border-slate-600 px-3 py-2 text-sm">Editar</button>
                      <button onClick={() => handleDeleteBook(book.id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm">Eliminar</button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-300">
                    {book.genre && <span className="rounded-full bg-violet-500/10 px-2 py-1">{book.genre}</span>}
                    {book.publishedYear && <span>{book.publishedYear}</span>}
                    {book.pages && <span>{book.pages} páginas</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)} className="rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-40">Anterior</button>
            <span className="text-sm text-slate-300">Página {page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)} className="rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-40">Siguiente</button>
          </div>
        </section>
      </div>
    </main>
  );
}
