"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Author = {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  nationality?: string | null;
  birthYear?: number | null;
  books?: { id: string; title: string; publishedYear?: number | null }[];
};

export default function AuthorDetailPage() {
  const params = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;
      setLoading(true);
      const [authorRes, statsRes] = await Promise.all([
        fetch(`/api/authors/${params.id}`),
        fetch(`/api/authors/${params.id}/stats`),
      ]);

      const authorData = await authorRes.json();
      const statsData = await statsRes.json();

      setAuthor(authorData);
      setStats(statsData);
      setLoading(false);
    };

    load();
  }, [params?.id]);

  if (loading) {
    return <main className="p-10 text-center text-white">Cargando autor...</main>;
  }

  if (!author) {
    return <main className="p-10 text-center text-red-400">Autor no encontrado</main>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-white">
      <div className="rounded-3xl border border-slate-700 bg-slate-900/60 p-8">
        <h1 className="text-4xl font-bold">{author.name}</h1>
        <p className="mt-2 text-slate-300">{author.email}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Total de libros</p>
            <p className="mt-2 text-2xl font-bold">{stats?.totalBooks ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Promedio páginas</p>
            <p className="mt-2 text-2xl font-bold">{stats?.averagePages ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Géneros</p>
            <p className="mt-2 text-2xl font-bold">{stats?.genres?.length ?? 0}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
            <h2 className="mb-3 text-xl font-semibold">Información</h2>
            <p className="text-slate-300">{author.bio || 'Sin biografía.'}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li><strong>Nacionalidad:</strong> {author.nationality || 'No disponible'}</li>
              <li><strong>Año de nacimiento:</strong> {author.birthYear || 'No disponible'}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
            <h2 className="mb-3 text-xl font-semibold">Estadísticas</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><strong>Primer libro:</strong> {stats?.firstBook?.title || 'N/A'} ({stats?.firstBook?.year || 'N/A'})</li>
              <li><strong>Último libro:</strong> {stats?.latestBook?.title || 'N/A'} ({stats?.latestBook?.year || 'N/A'})</li>
              <li><strong>Libro más largo:</strong> {stats?.longestBook?.title || 'N/A'} ({stats?.longestBook?.pages || 0} páginas)</li>
              <li><strong>Libro más corto:</strong> {stats?.shortestBook?.title || 'N/A'} ({stats?.shortestBook?.pages || 0} páginas)</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">Libros del autor</h2>
          <div className="space-y-3">
            {author.books?.map((book) => (
              <div key={book.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{book.title}</h3>
                    <p className="text-sm text-slate-400">{book.publishedYear || 'Sin año'}</p>
                  </div>
                  <button className="rounded-lg border border-slate-600 px-3 py-2 text-sm">Ver</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
