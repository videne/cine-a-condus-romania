import { useState, useMemo } from 'react';
import { PARTIES, ELECTIONS } from '../data/elections';

export default function PartiesPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const allParties = useMemo(() => {
    // Calculeaza cate alegeri a participat fiecare partid si daca mai exista
    const list = Object.values(PARTIES).map(p => {
      const appearances = ELECTIONS
        .filter(e => e.results.some(r => r.partyId === p.id))
        .map(e => e.year);
      return { ...p, appearances };
    });
    return list;
  }, []);

  const filtered = useMemo(() => {
    let list = allParties;
    if (filter === 'exists') list = list.filter(p => p.exists);
    if (filter === 'dissolved') list = list.filter(p => !p.exists);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.short.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.appearances.length - a.appearances.length);
  }, [allParties, filter, query]);

  return (
    <div className="container-editorial py-12 sm:py-20">
      <div className="max-w-3xl mb-10">
        <div className="kicker mb-3">Biografiile formațiunilor politice</div>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[0.95] mb-6">
          Toate partidele din Parlament
        </h1>
        <p className="font-serif text-lg sm:text-xl leading-relaxed text-ink/80">
          Lista completă a formațiunilor care au obținut mandate parlamentare între 1990 și 2024 —
          când au fost fondate, ce au devenit, dacă mai există astăzi.
        </p>
      </div>

      {/* search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          type="text"
          placeholder="Caută după nume sau acronim..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 border border-rule bg-paper px-4 py-3 focus:border-ink focus:outline-none font-serif text-base"
        />
        <div className="flex gap-2">
          <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>Toate</FilterBtn>
          <FilterBtn active={filter === 'exists'} onClick={() => setFilter('exists')}>Active</FilterBtn>
          <FilterBtn active={filter === 'dissolved'} onClick={() => setFilter('dissolved')}>Dispărute</FilterBtn>
        </div>
      </div>

      {/* list */}
      <div className="grid gap-4 sm:gap-5">
        {filtered.map(p => <PartyCard key={p.id} party={p} />)}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted font-serif text-lg">
            Niciun partid găsit pentru „{query}".
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm border transition-all ${
        active
          ? 'bg-ink text-paper border-ink'
          : 'bg-paper text-ink border-rule hover:border-ink'
      }`}
    >
      {children}
    </button>
  );
}

function PartyCard({ party }) {
  return (
    <div className="border border-rule bg-paper p-5 sm:p-6 hover:border-ink transition-colors">
      <div className="flex items-start gap-4 mb-3">
        <div className="w-2 self-stretch shrink-0 min-h-[3rem]" style={{ backgroundColor: party.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
            <h3 className="font-display text-xl sm:text-2xl font-semibold">{party.name}</h3>
            <span className="kicker">{party.short}</span>
          </div>
          <div className="text-xs font-mono text-muted">
            {party.founded && <span>Fondat în {party.founded}</span>}
            {party.dissolved && <span> · Dispărut în {party.dissolved}</span>}
            {party.exists && party.founded && !party.dissolved && <span> · activ și astăzi</span>}
          </div>
        </div>
        <div className={`chip shrink-0 ${party.exists ? 'bg-ink text-paper border-ink' : ''}`}>
          {party.exists ? 'Activ' : 'Dispărut'}
        </div>
      </div>
      <p className="font-serif text-base leading-relaxed text-ink/85 mb-4">
        {party.description}
      </p>
      {party.appearances.length > 0 && (
        <div className="pt-3 border-t border-rule">
          <div className="kicker mb-2">A intrat în Parlament</div>
          <div className="flex flex-wrap gap-2">
            {party.appearances.map(y => (
              <a
                key={y}
                href={`#/an/${y}`}
                className="chip hover:bg-ink hover:text-paper transition-colors"
              >
                {y}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
