import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ELECTIONS } from '../data/elections';
import { getLineageRanking } from '../utils/stats';

export default function Home() {
  const ranking = useMemo(() => getLineageRanking(), []);
  const [sortBy, setSortBy] = useState('cumulativePct');

  const sortedRanking = useMemo(() => {
    const copy = [...ranking];
    if (sortBy === 'cumulativePct') copy.sort((a, b) => b.cumulativePct - a.cumulativePct);
    if (sortBy === 'yearsAsPM') copy.sort((a, b) => b.yearsAsPM - a.yearsAsPM || b.cumulativePct - a.cumulativePct);
    if (sortBy === 'wins') copy.sort((a, b) => b.wins - a.wins || b.cumulativePct - a.cumulativePct);
    return copy.slice(0, 8);
  }, [ranking, sortBy]);

  return (
    <div>
      {/* HERO */}
      <section className="container-editorial pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="kicker mb-6">O cronică a alegerilor parlamentare</div>
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.95] font-semibold max-w-5xl mb-8">
          Cine a condus <br/>
          <span className="italic font-normal">România</span> din 1990 până azi?
        </h1>
        <p className="font-serif text-xl sm:text-2xl leading-relaxed max-w-3xl text-ink/80">
          Treizeci și patru de ani. Zece alegeri parlamentare. Treizeci și ceva de partide care au trecut
          prin Parlament. Aici le găsești pe toate — date oficiale, fără adjective, fără comentarii.
        </p>
        <div className="flex flex-wrap gap-3 mt-10">
          <button
            onClick={() => document.getElementById('clasament')?.scrollIntoView({ behavior: 'smooth' })}
            className="chip hover:bg-ink hover:text-paper transition-colors cursor-pointer"
          >
            Vezi clasamentul ↓
          </button>
          <button
            onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
            className="chip hover:bg-ink hover:text-paper transition-colors cursor-pointer"
          >
            Vezi toate alegerile ↓
          </button>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="border-y border-rule bg-ink text-paper">
        <div className="container-editorial py-10 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <Stat number="10" label="alegeri parlamentare" sublabel="1990 — 2024" />
            <Stat number="34" label="ani de democrație" sublabel="de la primul vot liber" />
            <Stat number="7" label="partide în Parlament" sublabel="după alegerile din 2024" />
            <Stat number="52,48%" label="prezența la vot" sublabel="în 2024, cea mai mare din 2004" />
          </div>
        </div>
      </section>

      {/* CLASAMENT */}
      <section id="clasament" className="container-editorial py-16 sm:py-24 scroll-mt-24">
        <div className="max-w-3xl mb-10">
          <div className="kicker mb-3">Partea I · Clasament general</div>
          <h2 className="font-display text-3xl sm:text-5xl leading-tight font-semibold mb-4">
            Care partide au condus cel mai mult?
          </h2>
          <p className="font-serif text-lg text-ink/80 leading-relaxed">
            Pentru a reflecta continuitatea politică reală, partidele care au fuzionat sau și-au
            schimbat numele (de exemplu FSN → FDSN → PDSR → PSD) sunt grupate împreună.
            <br/><br/>
            <span className="text-ink/60 text-base">
              <strong>Procent acumulat</strong> adună toate procentele obținute la toate alegerile — un partid care a
              luat 25% la 8 alegeri va fi deasupra unuia care a luat 30% la 2 alegeri.
              <strong> Ani ca prim-ministru</strong> numără doar perioadele efective de guvernare
              (nu participarea ca partener minor în coaliție).
            </span>
          </p>
        </div>

        {/* filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="kicker mr-2">Sortează după:</span>
          <FilterBtn active={sortBy === 'cumulativePct'} onClick={() => setSortBy('cumulativePct')}>
            Procent acumulat
          </FilterBtn>
          <FilterBtn active={sortBy === 'yearsAsPM'} onClick={() => setSortBy('yearsAsPM')}>
            Ani ca prim-ministru
          </FilterBtn>
          <FilterBtn active={sortBy === 'wins'} onClick={() => setSortBy('wins')}>
            Alegeri câștigate
          </FilterBtn>
        </div>

        {/* podium / bars */}
        <div className="space-y-3">
          {sortedRanking.map((item, idx) => (
            <RankingRow key={item.lineage} item={item} rank={idx + 1} sortBy={sortBy} maxValue={
              sortBy === 'cumulativePct' ? Math.max(...sortedRanking.map(s => s.cumulativePct)) :
              sortBy === 'yearsAsPM' ? Math.max(...sortedRanking.map(s => s.yearsAsPM), 1) :
              Math.max(...sortedRanking.map(s => s.wins), 1)
            } />
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" className="border-t border-rule bg-ink/[0.02]">
        <div className="container-editorial py-16 sm:py-24 scroll-mt-24">
          <div className="max-w-3xl mb-12">
            <div className="kicker mb-3">Partea a II-a · Cronologie</div>
            <h2 className="font-display text-3xl sm:text-5xl leading-tight font-semibold mb-4">
              Toate alegerile, una câte una.
            </h2>
            <p className="font-serif text-lg text-ink/80 leading-relaxed">
              Apasă pe oricare pentru a vedea rezultatele complete, prezența la vot,
              guvernul format și prim-ministrul rezultat.
            </p>
          </div>

          {/* Desktop timeline - orizontal */}
          <div className="hidden md:block relative">
            <div className="absolute top-[42px] left-0 right-0 h-px bg-rule" />
            <div className="grid grid-cols-5 gap-6">
              {ELECTIONS.map(e => (
                <TimelineCard key={e.year} election={e} />
              ))}
            </div>
          </div>

          {/* Mobile timeline - vertical */}
          <div className="md:hidden relative space-y-6">
            <div className="absolute top-0 bottom-0 left-[11px] w-px bg-rule" />
            {ELECTIONS.map(e => (
              <MobileTimelineCard key={e.year} election={e} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label, sublabel }) {
  return (
    <div>
      <div className="font-display text-4xl sm:text-5xl font-semibold leading-none mb-2">{number}</div>
      <div className="text-sm font-medium mb-0.5">{label}</div>
      <div className="text-xs text-paper/60">{sublabel}</div>
    </div>
  );
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
        active
          ? 'bg-ink text-paper border-ink'
          : 'bg-transparent text-ink border-rule hover:border-ink'
      }`}
    >
      {children}
    </button>
  );
}

function RankingRow({ item, rank, sortBy, maxValue }) {
  const value =
    sortBy === 'cumulativePct' ? item.cumulativePct :
    sortBy === 'yearsAsPM' ? item.yearsAsPM :
    item.wins;
  const display =
    sortBy === 'cumulativePct' ? `${item.cumulativePct.toFixed(0)} pct.` :
    sortBy === 'yearsAsPM' ? (item.yearsAsPM === 0 ? '—' : `${item.yearsAsPM} ani`) :
    `${item.wins} ${item.wins === 1 ? 'victorie' : 'victorii'}`;
  const width = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className="group relative overflow-hidden border border-rule bg-paper hover:border-ink transition-colors">
      {/* bar fill */}
      <div
        className="absolute inset-y-0 left-0 opacity-15 transition-all"
        style={{ width: `${width}%`, backgroundColor: item.color }}
      />
      <div className="relative flex items-center gap-4 p-4 sm:p-5">
        <div className="font-display text-2xl sm:text-3xl text-muted w-10 sm:w-12 shrink-0">
          {String(rank).padStart(2, '0')}
        </div>
        <div className="w-1 sm:w-1.5 self-stretch shrink-0" style={{ backgroundColor: item.color }} />
        <div className="flex-1 min-w-0">
          <div className="font-display text-lg sm:text-xl font-semibold truncate">{item.name}</div>
          <div className="text-xs text-muted font-mono mt-0.5">
            {item.elections} alegeri · cel mai bun rezultat: {item.bestResult.pct.toFixed(1)}% ({item.bestResult.year})
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-display text-2xl sm:text-3xl font-semibold leading-none">
            {display}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineCard({ election }) {
  const winner = [...election.results].sort((a, b) => b.pct - a.pct)[0];
  return (
    <Link to={`/an/${election.year}`} className="group relative block">
      <div className="relative z-10 w-[22px] h-[22px] rounded-full bg-paper border-2 border-ink mx-auto mb-4 group-hover:bg-ink transition-colors" />
      <div className="text-center">
        <div className="font-display text-2xl font-semibold mb-1">{election.year}</div>
        <div className="text-xs text-muted mb-3">{election.date}</div>
        <div className="border-t border-rule pt-3">
          <div className="kicker mb-1">Câștigător</div>
          <div className="text-sm font-medium">{winner.partyId}</div>
          <div className="text-xs text-muted font-mono">{winner.pct.toFixed(1)}%</div>
        </div>
      </div>
    </Link>
  );
}

function MobileTimelineCard({ election }) {
  const winner = [...election.results].sort((a, b) => b.pct - a.pct)[0];
  return (
    <Link to={`/an/${election.year}`} className="group relative flex items-start gap-4 pl-0">
      <div className="relative z-10 w-[22px] h-[22px] rounded-full bg-paper border-2 border-ink shrink-0 mt-1 group-hover:bg-ink transition-colors" />
      <div className="flex-1 border border-rule bg-paper p-4 group-hover:border-ink transition-colors">
        <div className="flex items-baseline justify-between gap-3">
          <div className="font-display text-2xl font-semibold">{election.year}</div>
          <div className="text-xs text-muted">{election.date}</div>
        </div>
        <div className="border-t border-rule mt-2 pt-2">
          <div className="kicker mb-0.5">Câștigător</div>
          <div className="text-sm">
            <span className="font-medium">{winner.partyId}</span>
            <span className="text-muted font-mono ml-2">{winner.pct.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
