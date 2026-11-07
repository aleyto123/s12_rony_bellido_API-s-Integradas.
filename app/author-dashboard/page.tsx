"use client";

import { useEffect, useState } from 'react';

type Author = {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  books?: { id: string; title: string }[];
};

export default function AuthorDashboardPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [nationality, setNationality] = useState('');
  const [birthYear, setBirthYear] = useState('');

  const loadAuthors = async () => {
    const res = await fetch('/api/authors');
    const data = await res.json();
    setAuthors(data);
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/authors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        bio,
        nationality,
        birthYear: birthYear ? Number(birthYear) : null,
      }),
    });
    setName('');
    setEmail('');
    setBio('');
    setNationality('');
    setBirthYear('');
    loadAuthors();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/authors/${id}`, { method: 'DELETE' });
    loadAuthors();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10 text-white">
      <div className="mb-8 rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Autorización</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Dashboard de autores</h1>
          </div>
          <a href="/" className="rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-100 hover:border-slate-500">
            Volver al inicio
          </a>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <form onSubmit={handleCreate} className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-soft">
          <h2 className="mb-5 text-xl font-bold">Agregar nuevo autor</h2>
          <div className="space-y-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre completo" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-white placeholder:text-slate-400" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-white placeholder:text-slate-400" />
            <div className="grid gap-4 md:grid-cols-2">
              <input value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="Nacionalidad" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-white placeholder:text-slate-400" />
              <input value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="Año de nacimiento" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-white placeholder:text-slate-400" />
            </div>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={5} placeholder="Biografía" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-white placeholder:text-slate-400" />
            <button type="submit" className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-500">
              Guardar autor
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {authors.map((author) => (
            <article key={author.id} className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-soft">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Autor</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{author.name}</h3>
                  <p className="mt-1 text-sm text-slate-300">{author.email}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a href={`/authors/${author.id}`} className="rounded-xl border border-slate-600 bg-slate-800/80 px-3 py-2 text-sm font-medium text-slate-100 hover:border-slate-500">
                    Ver detalle
                  </a>
                  <button onClick={() => handleDelete(author.id)} className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500">
                    Eliminar
                  </button>
                </div>
              </div>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">
                {author.bio || 'Sin biografía registrada.'}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
                <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-200">
                  {author.books?.length ?? 0} libros
                </span>
                <span className="text-xs text-slate-400">{author.id.slice(0, 10)}...</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
