import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getElectionByYear, getPartyById } from '../utils/stats';
import { ELECTIONS } from '../data/elections';

export default function ElectionPage() {
  const { year } = useParams();
  const election = getElectionByYear(year);

  if (!election) {
    return (
      <div className="container-editorial py-20 text-center">
        <h1 className="font-display text-3xl mb-4">An inexistent</h1>
        <Link to="/" className="link-underline">Înapoi la pagina principală</Link>
      </div>
    );
  }

  const winner = [...election.results].sort((a, b) => b.pct - a.pct)[0];
  const winnerParty = getPartyById(winner.partyId);

  // navigare intre ani
  const currentIdx = ELECTIONS.findIndex(e => e.year === election.year);
  const prev = ELECTIONS[currentIdx - 1];
  const next = ELECTIONS[currentIdx + 1];

  const chartData = election.results.map(r => {
    const party = getPartyById(r.partyId);
    return {
      name: party?.short || r.partyId,
      fullName: party?.name || r.partyId,
      procent: r.pct,
      mandate: r.seats,
      color: party?.color || '#888',
    };
  });

  return (
    <div>
      {/* HEADER */}
      <section className="container-editorial pt-10 sm:pt-16 pb-10 border-b border-rule">
        <Link to="/" className="kicker link-underline mb-6 inline-block">← Toate alegerile</Link>
        <div className="max-w-4xl">
          <div className="kicker mb-3">Alegeri parlamentare</div>
          <h1 className="font-display text-5xl sm:text-7xl font-semibold leading-none mb-4">
            {election.year}
          </h1>
          <div className="text-lg text-muted mb-8 font-mono">{election.date}</div>
          <p className="font-serif text-xl sm:text-2xl leading-relaxed text-ink/85">
            {election.description}
          </p>
        </div>
      </section>

      {/* KEY FACTS */}
      <section className="container-editorial py-10 border-b border-rule">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
          <KeyFact
            label="Prezența la vot"
            value={`${election.turnout.toFixed(2)}%`}
          />
          <KeyFact
            label="Total mandate"
            value={election.totalSeats}
            sub="Camera + Senat"
          />
          <KeyFact
            label="Prag electoral"
            value={election.electoralThreshold ? `${election.electoralThreshold}%` : '—'}
            sub={!election.electoralThreshold ? 'Nu era stabilit' : ''}
          />
          <KeyFact
            label="Câștigător"
            value={winnerParty?.short || winner.partyId}
            sub={`${winner.pct.toFixed(2)}%`}
          />
        </div>
      </section>

      {/* RESULTS CHART */}
      <section className="container-editorial py-12 sm:py-16">
        <div className="kicker mb-3">Rezultate</div>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-8">
          Cine a intrat în Parlament
        </h2>

        {/* Horizontal bars */}
        <div className="space-y-3 mb-12">
          {election.results.map(r => {
            const party = getPartyById(r.partyId);
            const maxPct = Math.max(...election.results.map(x => x.pct));
            const width = (r.pct / maxPct) * 100;
            return (
              <div key={r.partyId} className="relative overflow-hidden border border-rule bg-paper">
                <div
                  className="absolute inset-y-0 left-0 opacity-20"
                  style={{ width: `${width}%`, backgroundColor: party?.color || '#888' }}
                />
                <div className="relative flex items-center gap-4 p-4">
                  <div className="w-1.5 self-stretch shrink-0" style={{ backgroundColor: party?.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg font-semibold">
                      {party?.short || r.partyId}
                    </div>
                    <div className="text-xs text-muted truncate">{party?.name}</div>
                  </div>
                  <div className="text-right shrink-0 flex items-baseline gap-6">
                    <div>
                      <div className="font-display text-2xl font-semibold leading-none">{r.pct.toFixed(2)}%</div>
                      <div className="kicker mt-1">Procent</div>
                    </div>
                    <div>
                      <div className="font-display text-2xl font-semibold leading-none">{r.seats}</div>
                      <div className="kicker mt-1">Mandate</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recharts visual */}
        <div className="border border-rule bg-paper p-4 sm:p-6">
          <div className="kicker mb-4">Reprezentare grafică · procente</div>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'Inter' }} />
                <YAxis tick={{ fontSize: 12, fontFamily: 'Inter' }} unit="%" />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                />
                <Bar dataKey="procent">
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* GOVERNMENT */}
      <section className="border-t border-rule bg-ink text-paper">
        <div className="container-editorial py-12 sm:py-16">
          <div className="kicker text-paper/60 mb-3">Urmarea alegerilor</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-8">
            Cine a format guvernul
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <div className="kicker text-paper/60 mb-2">Coaliția de guvernare</div>
              <div className="font-serif text-xl sm:text-2xl leading-snug">{election.winnerCoalition}</div>
            </div>
            <div>
              <div className="kicker text-paper/60 mb-2">Prim-ministru</div>
              <div className="font-serif text-xl sm:text-2xl leading-snug">{election.primeMinister}</div>
            </div>
          </div>
          {election.note && (
            <div className="mt-8 pt-8 border-t border-paper/20">
              <div className="kicker text-paper/60 mb-2">Notă</div>
              <p className="text-paper/80 font-serif text-lg leading-relaxed max-w-3xl">{election.note}</p>
            </div>
          )}
        </div>
      </section>

      {/* NAVIGATION */}
      <section className="container-editorial py-10 grid grid-cols-2 gap-4">
        {prev ? (
          <Link to={`/an/${prev.year}`} className="border border-rule p-5 hover:border-ink transition-colors group">
            <div className="kicker mb-1">← Alegerile anterioare</div>
            <div className="font-display text-2xl font-semibold">{prev.year}</div>
          </Link>
        ) : <div />}
        {next ? (
          <Link to={`/an/${next.year}`} className="border border-rule p-5 text-right hover:border-ink transition-colors group">
            <div className="kicker mb-1">Alegerile următoare →</div>
            <div className="font-display text-2xl font-semibold">{next.year}</div>
          </Link>
        ) : <div />}
      </section>
    </div>
  );
}

function KeyFact({ label, value, sub }) {
  return (
    <div>
      <div className="kicker mb-2">{label}</div>
      <div className="font-display text-2xl sm:text-3xl font-semibold leading-tight">{value}</div>
      {sub && <div className="text-xs text-muted mt-1 font-mono">{sub}</div>}
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-ink text-paper px-3 py-2 text-sm font-mono">
      <div className="font-medium mb-0.5">{d.fullName}</div>
      <div>{d.procent.toFixed(2)}% · {d.mandate} mandate</div>
    </div>
  );
}
