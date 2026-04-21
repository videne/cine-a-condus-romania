import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LINEAGE_NAMES, ELECTIONS, PARTY_LINEAGE } from '../data/elections';
import { getLineageTimeSeries } from '../utils/stats';

export default function ComparePage() {
  const lineages = Object.keys(LINEAGE_NAMES);
  const [selected, setSelected] = useState(['FSN_PSD', 'PNL', 'USR']);

  function toggle(id) {
    if (selected.includes(id)) {
      setSelected(selected.filter(x => x !== id));
    } else if (selected.length < 5) {
      setSelected([...selected, id]);
    }
  }

  // construieste seriile pentru recharts: o linie per lineage selectat
  const chartData = ELECTIONS.map(e => {
    const row = { year: e.year };
    selected.forEach(id => {
      const result = e.results.find(r => PARTY_LINEAGE[r.partyId] === id);
      row[id] = result ? Number(result.pct.toFixed(2)) : null;
    });
    return row;
  });

  return (
    <div className="container-editorial py-12 sm:py-20">
      <div className="max-w-3xl mb-10">
        <div className="kicker mb-3">Grafic comparativ</div>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[0.95] mb-6">
          Compară partide în timp
        </h1>
        <p className="font-serif text-lg sm:text-xl leading-relaxed text-ink/80">
          Selectează până la 5 partide pentru a le vedea evoluția procentelor obținute la alegerile
          parlamentare din 1990 încoace. Partidele care au fuzionat sunt grupate împreună
          (de ex. FSN/FDSN/PDSR/PSD).
        </p>
      </div>

      {/* selector */}
      <div className="mb-10">
        <div className="kicker mb-3">Selectează ({selected.length}/5)</div>
        <div className="flex flex-wrap gap-2">
          {lineages.map(id => {
            const l = LINEAGE_NAMES[id];
            const active = selected.includes(id);
            const disabled = !active && selected.length >= 5;
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                disabled={disabled}
                className={`px-3 py-2 text-sm border transition-all flex items-center gap-2 ${
                  active
                    ? 'border-ink bg-ink text-paper'
                    : disabled
                      ? 'border-rule bg-paper text-muted/40 cursor-not-allowed'
                      : 'border-rule bg-paper text-ink hover:border-ink'
                }`}
              >
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: l.color }} />
                {l.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* chart */}
      <div className="border border-rule bg-paper p-4 sm:p-8">
        {selected.length === 0 ? (
          <div className="text-center py-20 text-muted font-serif text-lg">
            Selectează cel puțin un partid pentru a vedea graficul.
          </div>
        ) : (
          <div style={{ width: '100%', height: 420 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C2" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fontFamily: 'Inter' }} />
                <YAxis tick={{ fontSize: 12, fontFamily: 'Inter' }} unit="%" />
                <Tooltip content={<CompareTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter' }} />
                {selected.map(id => (
                  <Line
                    key={id}
                    type="monotone"
                    dataKey={id}
                    name={LINEAGE_NAMES[id].short}
                    stroke={LINEAGE_NAMES[id].color}
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 2, fill: '#F5F1E8' }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* tabel */}
      {selected.length > 0 && (
        <div className="mt-10">
          <div className="kicker mb-3">Valori exacte</div>
          <div className="overflow-x-auto border border-rule">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-ink/5">
                  <th className="text-left p-3 font-medium">An</th>
                  {selected.map(id => (
                    <th key={id} className="text-right p-3 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: LINEAGE_NAMES[id].color }} />
                        {LINEAGE_NAMES[id].short}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartData.map(row => (
                  <tr key={row.year} className="border-b border-rule last:border-b-0 hover:bg-ink/5">
                    <td className="p-3 font-mono">{row.year}</td>
                    {selected.map(id => (
                      <td key={id} className="text-right p-3 font-mono">
                        {row[id] !== null && row[id] !== undefined ? `${row[id].toFixed(2)}%` : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted font-mono mt-3">
            „—" înseamnă că partidul nu a participat sau nu a trecut pragul electoral la acel scrutin.
          </p>
        </div>
      )}
    </div>
  );
}

function CompareTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ink text-paper px-3 py-2 text-xs font-mono">
      <div className="font-medium mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: {p.value?.toFixed(2)}%
        </div>
      ))}
    </div>
  );
}
