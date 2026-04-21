import { useState, useMemo } from 'react';

// Datele partidelor din Parlamentul 2024
// Pozitiile ideologice sunt aproximative, bazate pe discursul public al fiecarui partid
// - Economic: 0 (stanga, redistributiv) -> 10 (dreapta, pro-piata)
// - Europenism: 0 (anti-UE, suveranist) -> 10 (puternic pro-UE)
const PARTIES_2024 = [
  { id: 'PSD',  name: 'Partidul Social Democrat',           short: 'PSD',   pct: 21.96, color: '#B22222', econ: 3, eu: 8 },
  { id: 'AUR',  name: 'Alianța pentru Unirea Românilor',    short: 'AUR',   pct: 18.01, color: '#8B6914', econ: 4, eu: 2 },
  { id: 'PNL',  name: 'Partidul Național Liberal',          short: 'PNL',   pct: 13.20, color: '#F7D417', econ: 7, eu: 9 },
  { id: 'USR',  name: 'Uniunea Salvați România',            short: 'USR',   pct: 12.40, color: '#1976D2', econ: 7, eu: 10 },
  { id: 'SOS',  name: 'S.O.S. România',                     short: 'SOS',   pct: 7.35,  color: '#D32F2F', econ: 3, eu: 1 },
  { id: 'POT',  name: 'Partidul Oamenilor Tineri',          short: 'POT',   pct: 6.45,  color: '#00796B', econ: 4, eu: 2 },
  { id: 'UDMR', name: 'Uniunea Democrată Maghiară',         short: 'UDMR',  pct: 6.34,  color: '#2E7D32', econ: 6, eu: 9 },
];

// Calcul coerenta: cat de apropiati sunt partenerii pe cele 2 axe.
// Penalizeaza mai puternic diferentele pe axa europenism (asta rupe coalitiile in RO):
// diferentele pe axa "eu" conteaza dublu fata de cele economice.
function calculateCoherence(selectedParties) {
  if (selectedParties.length < 2) return 100; // 1 partid singur = coerenta maxima
  let totalDistance = 0;
  let pairs = 0;
  for (let i = 0; i < selectedParties.length; i++) {
    for (let j = i + 1; j < selectedParties.length; j++) {
      const a = selectedParties[i];
      const b = selectedParties[j];
      // Distanta ponderata: axa europenism cu weight 2, axa economic cu weight 1
      const dist = Math.sqrt(
        Math.pow(a.econ - b.econ, 2) + 2 * Math.pow(a.eu - b.eu, 2)
      );
      totalDistance += dist;
      pairs += 1;
    }
  }
  const avgDistance = totalDistance / pairs;
  // Distanta maxima cu weight-uri: sqrt(100 + 200) = sqrt(300) ≈ 17.32
  const maxDist = Math.sqrt(300);
  const coherence = Math.max(0, 100 - (avgDistance / maxDist) * 100);
  return Math.round(coherence);
}

function getCoherenceLabel(score) {
  if (score >= 85) return { label: 'Foarte coerentă', color: '#1B5E3F' };
  if (score >= 70) return { label: 'Coerentă', color: '#2E7D32' };
  if (score >= 55) return { label: 'Acceptabilă', color: '#7B6A1E' };
  if (score >= 40) return { label: 'Fragilă', color: '#B87333' };
  return { label: 'Imposibilă', color: '#B22222' };
}

function getFinalVerdict(pct, coherence) {
  if (pct < 50) return {
    title: 'Fără majoritate',
    desc: 'Coaliția ta nu depășește pragul de 50%. Guvernul nu se poate forma.',
    color: '#B22222',
  };
  if (coherence >= 85) return {
    title: 'Coaliție solidă',
    desc: 'Parteneri apropiați ideologic, cu viziuni similare. Un guvern stabil, care poate dura întregul mandat.',
    color: '#1B5E3F',
  };
  if (coherence >= 70) return {
    title: 'Coaliție funcțională',
    desc: 'Diferențe gestionabile între parteneri. Guvernul poate funcționa cu compromisuri rezonabile.',
    color: '#2E7D32',
  };
  if (coherence >= 55) return {
    title: 'Coaliție tensionată',
    desc: 'Aveți majoritate, dar diferențe serioase între parteneri. Guvernul va fi marcat de conflicte și probabil se va destrăma înainte de termen.',
    color: '#7B6A1E',
  };
  if (coherence >= 40) return {
    title: 'Coaliție fragilă',
    desc: 'Parteneri incompatibili ideologic forțați împreună. Majoritatea există pe hârtie, dar guvernul va fi paralizat de neînțelegeri.',
    color: '#B87333',
  };
  return {
    title: 'Coaliție imposibilă',
    desc: 'Ai pus împreună partide fundamental opuse. Chiar dacă adună 50%, un astfel de guvern nu poate funcționa în realitate.',
    color: '#B22222',
  };
}

export default function GamePage() {
  const [selected, setSelected] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const selectedParties = useMemo(
    () => PARTIES_2024.filter(p => selected.includes(p.id)),
    [selected]
  );

  const totalPct = selectedParties.reduce((sum, p) => sum + p.pct, 0);
  const coherence = calculateCoherence(selectedParties);
  const hasMajority = totalPct >= 50;
  const coherenceLabel = getCoherenceLabel(coherence);

  function toggle(id) {
    if (showResult) return;
    setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  }

  function reset() {
    setSelected([]);
    setShowResult(false);
  }

  const verdict = getFinalVerdict(totalPct, coherence);

  return (
    <div className="container-editorial py-10 sm:py-16">
      {/* INTRO */}
      <div className="max-w-3xl mb-10">
        <div className="kicker mb-3">Joc · Alegerile 2024</div>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[0.95] mb-6">
          Formează o coaliție.
        </h1>
        <p className="font-serif text-lg sm:text-xl leading-relaxed text-ink/80 mb-4">
          Alegerile din 1 decembrie 2024. Niciun partid nu a obținut majoritatea.
          Tu ești cel care trebuie să formeze guvernul.
        </p>
        <p className="font-serif text-base leading-relaxed text-ink/70">
          Selectează partidele care formează coaliția. Ai nevoie de <strong>peste 50%</strong> ca să ai majoritate,
          dar trebuie să te gândești și la <strong>coerența ideologică</strong> — o coaliție
          cu parteneri fundamental opuși nu rezistă, chiar dacă adună procentele necesare.
        </p>
      </div>

      {/* PARTIDE */}
      <div className="mb-8">
        <div className="kicker mb-4">Partidele din Parlamentul 2024</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {PARTIES_2024.map(p => {
            const isSelected = selected.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                disabled={showResult}
                className={`relative overflow-hidden text-left border transition-all p-4 ${
                  isSelected
                    ? 'border-ink bg-ink text-paper'
                    : 'border-rule bg-paper hover:border-ink'
                } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-1.5 self-stretch shrink-0 min-h-[3rem]"
                    style={{ backgroundColor: p.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <div className="font-display text-lg font-semibold">{p.short}</div>
                      <div className={`font-mono text-sm ${isSelected ? 'text-paper/70' : 'text-muted'}`}>
                        {p.pct.toFixed(2)}%
                      </div>
                    </div>
                    <div className={`text-xs truncate ${isSelected ? 'text-paper/60' : 'text-muted'}`}>
                      {p.name}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 text-xs">✓</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* PANOU INDICATORI */}
      <div className="border border-rule bg-paper p-5 sm:p-6 mb-8">
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {/* Procent majoritate */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <div className="kicker">Total coaliție</div>
              <div className="font-display text-2xl font-semibold">
                {totalPct.toFixed(2)}%
              </div>
            </div>
            <div className="relative h-3 bg-rule/50 overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 transition-all ${
                  hasMajority ? 'bg-ink' : 'bg-muted/60'
                }`}
                style={{ width: `${Math.min(totalPct, 100)}%` }}
              />
              {/* linie la 50% */}
              <div className="absolute inset-y-0 w-px bg-accent" style={{ left: '50%' }} />
            </div>
            <div className="flex justify-between text-xs font-mono text-muted mt-1">
              <span>0%</span>
              <span className="text-accent">50% prag majoritate</span>
              <span>100%</span>
            </div>
          </div>

          {/* Coerenta */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <div className="kicker">Coerență ideologică</div>
              <div className="font-display text-2xl font-semibold">
                {selected.length === 0 ? '—' : `${coherence}`}
              </div>
            </div>
            <div className="relative h-3 bg-rule/50 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 transition-all"
                style={{
                  width: selected.length === 0 ? '0%' : `${coherence}%`,
                  backgroundColor: coherenceLabel.color,
                }}
              />
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: coherenceLabel.color }}>
              {selected.length === 0 ? 'Selectează partide pentru a începe' : coherenceLabel.label}
            </div>
          </div>
        </div>

        {/* Actiuni */}
        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-rule">
          {!showResult ? (
            <>
              <button
                onClick={() => setShowResult(true)}
                disabled={selected.length === 0}
                className="flex-1 px-4 py-3 bg-ink text-paper font-medium hover:bg-ink/90 transition-colors disabled:bg-muted disabled:cursor-not-allowed"
              >
                Formează coaliția →
              </button>
              <button
                onClick={reset}
                disabled={selected.length === 0}
                className="px-4 py-3 border border-rule hover:border-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resetează
              </button>
            </>
          ) : (
            <button
              onClick={reset}
              className="flex-1 px-4 py-3 border border-ink bg-paper text-ink font-medium hover:bg-ink hover:text-paper transition-colors"
            >
              Încearcă o altă coaliție ↺
            </button>
          )}
        </div>
      </div>

      {/* REZULTAT */}
      {showResult && (
        <div className="border-2 border-ink bg-paper p-6 sm:p-8 mb-10">
          <div className="kicker mb-3">Verdict</div>
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold mb-4"
            style={{ color: verdict.color }}
          >
            {verdict.title}
          </h2>
          <p className="font-serif text-lg leading-relaxed text-ink/85 mb-6">
            {verdict.desc}
          </p>
          <div className="grid grid-cols-2 gap-4 pt-5 border-t border-rule">
            <div>
              <div className="kicker mb-1">Majoritate</div>
              <div className="font-display text-2xl font-semibold">
                {totalPct.toFixed(2)}%
              </div>
              <div className="text-xs font-mono text-muted mt-1">
                {hasMajority ? 'peste prag' : `lipsă ${(50 - totalPct).toFixed(2)}%`}
              </div>
            </div>
            <div>
              <div className="kicker mb-1">Coerență</div>
              <div
                className="font-display text-2xl font-semibold"
                style={{ color: coherenceLabel.color }}
              >
                {coherence}/100
              </div>
              <div
                className="text-xs font-mono mt-1"
                style={{ color: coherenceLabel.color }}
              >
                {coherenceLabel.label}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPLICATIE */}
      <div className="max-w-3xl mt-12 pt-8 border-t border-rule">
        <div className="kicker mb-3">Cum funcționează scoringul</div>
        <p className="font-serif text-base leading-relaxed text-ink/75 mb-3">
          Fiecare partid are o poziție aproximativă pe două axe: <strong>economic</strong> (de la
          stânga redistributivă la dreapta pro-piață) și <strong>europenism</strong> (de la
          suveranism la atlanticism).
        </p>
        <p className="font-serif text-base leading-relaxed text-ink/75 mb-3">
          Coerența se calculează ca media distanțelor dintre toate perechile de parteneri.
          O coaliție cu parteneri apropiați pe ambele axe primește un scor mare.
          Combinațiile contradictorii — cum ar fi un partid pro-UE cu unul suveranist —
          primesc scor mic.
        </p>
        <p className="font-serif text-sm leading-relaxed text-muted italic">
          Notă: pozițiile ideologice sunt estimări, nu clasificări oficiale. Jocul simplifică
          deliberat realitatea politică. Scopul lui e să arate cât de grea e matematica formării
          unui guvern stabil, nu să ofere o analiză academică riguroasă.
        </p>
      </div>
    </div>
  );
}
