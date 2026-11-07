const cards = [
  {
    title: 'Autores',
    value: 'CRUD completo',
    text: 'Crear, listar, editar y eliminar autores de la biblioteca.',
    href: '/author-dashboard',
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    title: 'Libros',
    value: 'Búsqueda + filtros',
    text: 'Busca por título, género, autor, ordena y pagina resultados.',
    href: '/books',
    accent: 'from-cyan-500 to-sky-500',
  },
  {
    title: 'Estadísticas',
    value: 'Reportes',
    text: 'Consulta métricas por autor y análisis de libros publicados.',
    href: '/author-dashboard',
    accent: 'from-emerald-500 to-teal-500',
  },
];

export default function HomePage() {
  return (
    <main className="px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-soft backdrop-blur-xl md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200">
                Biblioteca API
              </p>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                Sistema de <span className="text-gradient">autores y libros</span>
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/author-dashboard" className="rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white transition hover:bg-violet-500">
                Dashboard
              </a>
              <a href="/books" className="rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-2.5 font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-700/80">
                Ver libros
              </a>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950/70 p-7 shadow-soft">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Resumen general</p>
            <h2 className="mt-4 text-3xl font-bold text-white">Gestión moderna de la biblioteca</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Proyecto construido con Next.js App Router, Prisma ORM y PostgreSQL en Supabase. Incluye CRUD de autores, gestión de libros, búsquedas avanzadas, filtros, paginación y métricas por autor.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/books" className="rounded-xl bg-cyan-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400">
                Ir a búsquedas
              </a>
              <a href="/author-dashboard" className="rounded-xl border border-slate-600 bg-slate-900/60 px-4 py-2.5 font-semibold text-slate-100 transition hover:border-slate-500">
                Administrar autores
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { label: 'Autores', value: 'CRUD' },
              { label: 'Libros', value: 'Filtros' },
              { label: 'Estadísticas', value: 'API' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <a key={card.title} href={card.href} className="group block rounded-[24px] border border-white/10 bg-slate-900/70 p-6 shadow-soft transition hover:-translate-y-1 hover:border-violet-500/40 hover:bg-slate-900/80">
              <div className={`mb-4 h-12 w-12 rounded-2xl bg-gradient-to-br ${card.accent}`} />
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{card.title}</p>
              <h3 className="mt-3 text-2xl font-bold text-white">{card.value}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{card.text}</p>
            </a>
          ))}
        </section>
      </div>
    </main>
  );
}
