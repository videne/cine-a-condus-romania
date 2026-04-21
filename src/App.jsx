import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ElectionPage from './pages/ElectionPage';
import PartiesPage from './pages/PartiesPage';
import ComparePage from './pages/ComparePage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/an/:year" element={<ElectionPage />} />
          <Route path="/partide" element={<PartiesPage />} />
          <Route path="/compara" element={<ComparePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Acasă' },
    { to: '/partide', label: 'Partide' },
    { to: '/compara', label: 'Comparare' },
  ];

  return (
    <header className="border-b border-rule bg-paper/80 backdrop-blur sticky top-0 z-40">
      <div className="container-editorial py-4 sm:py-5 flex items-center justify-between gap-4">
        <Link to="/" className="group">
          <div className="kicker mb-0.5">România · 1990 — 2024</div>
          <div className="font-display text-lg sm:text-xl font-semibold leading-none">
            Cine a condus România?
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'text-ink font-medium'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {l.label}
                {active && <div className="h-px bg-ink mt-1" />}
              </Link>
            );
          })}
          <a
            href="https://www.buymeacoffee.com/2AQsWGnJNC"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-3 py-1.5 text-sm border border-ink bg-ink text-paper hover:bg-paper hover:text-ink transition-colors"
          >
            <span className="text-xs">♥</span>
            Susține proiectul
          </a>
          <a
            href="https://www.buymeacoffee.com/2AQsWGnJNC"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Susține proiectul"
            className="sm:hidden inline-flex items-center justify-center ml-2 w-9 h-9 border border-ink bg-ink text-paper hover:bg-paper hover:text-ink transition-colors"
          >
            ♥
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-rule mt-20">
      <div className="container-editorial py-10 text-sm text-muted">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="font-display text-ink text-base mb-1">Cine a condus România?</div>
            <div>Date oficiale: Autoritatea Electorală Permanentă, Biroul Electoral Central, INSSE.</div>
          </div>
          <div className="text-xs font-mono">
            Proiect neutru politic · Doar cifre · Fără comentarii.
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-rule flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="text-muted">
            Proiectul este gratuit și fără reclame.
          </div>
          <a
            href="https://www.buymeacoffee.com/2AQsWGnJNC"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-ink hover:text-accent transition-colors font-medium"
          >
            <span>♥</span>
            Susține proiectul pe Buy Me a Coffee →
          </a>
        </div>
      </div>
    </footer>
  );
}
