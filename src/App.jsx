import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ElectionPage from './pages/ElectionPage';
import PartiesPage from './pages/PartiesPage';
import ComparePage from './pages/ComparePage';
import GamePage from './pages/GamePage';

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
          <Route path="/coalitie" element={<GamePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'Acasă' },
    { to: '/partide', label: 'Partide' },
    { to: '/compara', label: 'Comparare' },
    { to: '/coalitie', label: 'Joc' },
  ];

  const BMC_URL = 'https://www.buymeacoffee.com/2AQsWGnJNC';

  // Inchide meniul la schimbarea de ruta
  const handleNavClick = () => setMenuOpen(false);

  return (
    <header className="border-b border-rule bg-paper/90 backdrop-blur sticky top-0 z-40">
      <div className="container-editorial py-3 sm:py-5 flex items-center justify-between gap-3">
        {/* Logo / titlu */}
        <Link to="/" onClick={handleNavClick} className="group min-w-0 flex-1 sm:flex-initial">
          <div className="kicker mb-0.5 truncate">România · 1990 — 2024</div>
          <div className="font-display text-base sm:text-xl font-semibold leading-none truncate">
            Cine a condus România?
          </div>
        </Link>

        {/* Navigatie desktop */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {links.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 text-sm transition-colors ${
                  active ? 'text-ink font-medium' : 'text-muted hover:text-ink'
                }`}
              >
                {l.label}
                {active && <div className="h-px bg-ink mt-1" />}
              </Link>
            );
          })}
          <a
            href={BMC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 ml-2 px-3 py-1.5 text-sm border border-ink bg-ink text-paper hover:bg-paper hover:text-ink transition-colors"
          >
            <span className="text-xs">♥</span>
            Susține proiectul
          </a>
        </nav>

        {/* Buton hamburger mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 border border-rule hover:border-ink transition-colors shrink-0"
          aria-label={menuOpen ? 'Închide meniul' : 'Deschide meniul'}
          aria-expanded={menuOpen}
        >
          <div className="w-4 flex flex-col gap-1">
            <span className={`block h-px bg-ink transition-transform ${menuOpen ? 'translate-y-[5px] rotate-45' : ''}`} />
            <span className={`block h-px bg-ink transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-ink transition-transform ${menuOpen ? '-translate-y-[5px] -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      {/* Panou mobile - slide down */}
      <div
        className={`md:hidden border-t border-rule overflow-hidden transition-[max-height,opacity] duration-300 ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container-editorial py-4 flex flex-col gap-1">
          {links.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={handleNavClick}
                className={`px-3 py-3 text-base border-l-2 transition-colors ${
                  active
                    ? 'border-ink text-ink font-medium'
                    : 'border-transparent text-muted hover:text-ink hover:border-rule'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href={BMC_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleNavClick}
            className="mt-3 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm border border-ink bg-ink text-paper hover:bg-paper hover:text-ink transition-colors"
          >
            <span>♥</span>
            Susține proiectul
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
