import { ELECTIONS, PARTY_LINEAGE, LINEAGE_NAMES, YEARS_IN_POWER, PARTIES } from '../data/elections';

// Agregheaza rezultatele pe "lineage" (grupuri de continuitate)
export function getLineageRanking() {
  const map = {};

  ELECTIONS.forEach(election => {
    election.results.forEach(r => {
      const lineage = PARTY_LINEAGE[r.partyId];
      if (!lineage) return;
      if (!map[lineage]) {
        map[lineage] = {
          lineage,
          ...LINEAGE_NAMES[lineage],
          totalPct: 0,
          elections: 0,
          wins: 0,
          bestResult: { pct: 0, year: null },
          appearances: [],
        };
      }
      map[lineage].totalPct += r.pct;
      map[lineage].elections += 1;
      map[lineage].appearances.push({ year: election.year, pct: r.pct, seats: r.seats });
      if (r.pct > map[lineage].bestResult.pct) {
        map[lineage].bestResult = { pct: r.pct, year: election.year };
      }
    });
  });

  // numara victorii: partidul cu cel mai mare procent din fiecare alegere
  ELECTIONS.forEach(election => {
    const sorted = [...election.results].sort((a, b) => b.pct - a.pct);
    if (sorted.length === 0) return;
    const winnerLineage = PARTY_LINEAGE[sorted[0].partyId];
    if (winnerLineage && map[winnerLineage]) {
      map[winnerLineage].wins += 1;
    }
  });

  return Object.values(map).map(l => ({
    ...l,
    avgPct: l.elections > 0 ? l.totalPct / l.elections : 0,
    yearsInPower: YEARS_IN_POWER[l.lineage] || 0,
  })).sort((a, b) => b.yearsInPower - a.yearsInPower || b.avgPct - a.avgPct);
}

export function getPartyById(id) {
  return PARTIES[id];
}

export function getElectionByYear(year) {
  return ELECTIONS.find(e => e.year === Number(year));
}

// Pentru comparare: procentele unui lineage de-a lungul timpului
export function getLineageTimeSeries(lineageId) {
  const series = ELECTIONS.map(e => {
    const result = e.results.find(r => PARTY_LINEAGE[r.partyId] === lineageId);
    return {
      year: e.year,
      pct: result ? result.pct : null,
    };
  });
  return series;
}
