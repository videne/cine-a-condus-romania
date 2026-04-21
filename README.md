# Cine a condus România? (1990 — 2024)

O platformă web care indexează și prezintă vizual rezultatele tuturor alegerilor parlamentare din România, din 1990 până în 2024. Date oficiale, fără comentarii politice.

**Stack:** React 18 · Vite · Tailwind CSS · Recharts · React Router (HashRouter pentru compatibilitate cu GitHub Pages).

---

## 📦 Ce include

- **Pagina principală** cu clasament general (ani la guvernare, procent mediu, alegeri câștigate), statistici cheie și cronologie interactivă pentru toate cele 10 alegeri parlamentare
- **Pagină individuală pentru fiecare an** (1990, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024) cu rezultate, grafice, prezență la vot, coaliția câștigătoare și prim-ministrul
- **Pagina „Partide"** cu listă completă (~25 partide), căutare și filtrare după status (active / dispărute)
- **Pagina „Comparare"** — selectezi până la 5 partide și vezi evoluția procentelor pe un grafic linear
- Responsive (mobile-first), accesibil, fără librării inutile

---

## 🚀 Cum să rulezi local

Ai nevoie de [Node.js](https://nodejs.org/) versiunea 18 sau mai nouă.

```bash
# 1. Instalează dependințele
npm install

# 2. Rulează serverul de dezvoltare
npm run dev
```

Deschide http://localhost:5173 în browser.

---

## 🌍 Cum să urci pe GitHub și să deployezi pe GitHub Pages

### Pasul 1 — Creează repo pe GitHub

1. Du-te pe https://github.com/new
2. Dă-i un nume (de exemplu `cine-a-condus-romania`)
3. Lasă-l **Public**
4. NU bifa „Add a README file" (avem deja unul)
5. Click **Create repository**

### Pasul 2 — Urcă codul

În terminal, din folderul proiectului:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/cine-a-condus-romania.git
git push -u origin main
```

Înlocuiește `USERNAME` cu user-ul tău GitHub.

### Pasul 3 — Activează GitHub Pages

1. Mergi în repo → tab-ul **Settings**
2. În meniul stâng, click **Pages**
3. La „Build and deployment" → „Source", alege **GitHub Actions**
4. Gata. La următorul push pe `main`, workflow-ul din `.github/workflows/deploy.yml` va construi și publica site-ul automat.

### Pasul 4 — Vezi-l live

După ~1-2 minute, site-ul va fi disponibil la:

```
https://USERNAME.github.io/cine-a-condus-romania/
```

Poți urmări deploy-ul în tab-ul **Actions** al repo-ului.

> **Notă:** Proiectul folosește `HashRouter` (URL-uri de tip `/#/an/2024`). Asta e necesar pentru că GitHub Pages nu suportă rute client-side în mod normal. Nu trebuie să modifici nimic.

---

## 📁 Structura proiectului

```
cine-a-condus-romania/
├── .github/workflows/deploy.yml   # Auto-deploy pe GitHub Pages
├── src/
│   ├── components/                 # (rezervat pentru extinderi)
│   ├── data/
│   │   └── elections.js           # TOATE datele alegerilor + partidelor
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ElectionPage.jsx
│   │   ├── PartiesPage.jsx
│   │   └── ComparePage.jsx
│   ├── utils/
│   │   └── stats.js               # Calculări agregate (clasamente etc.)
│   ├── App.jsx                    # Layout + routing
│   ├── main.jsx
│   └── index.css                  # Tailwind + stiluri custom
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

---

## 📝 Cum să modifici datele

Toate datele sunt în **un singur fișier**: `src/data/elections.js`.

Acolo găsești:
- `PARTIES` — obiect cu toate partidele (nume, culoare, descriere, dacă mai există)
- `ELECTIONS` — array cu toate cele 10 alegeri, fiecare cu rezultate, prezență, coaliție, PM
- `PARTY_LINEAGE` — harta de continuitate (ex: FSN → PSD) folosită în clasament
- `YEARS_IN_POWER` — ani aproximativi la guvernare pentru fiecare „lineage"

Schimbă valorile și da refresh. Totul e front-end static, nu ai nevoie de bază de date.

---

## 🎨 Design

Aestetica este **editorială** — inspirată de cronici istorice și reviste de cultură:
- Tipografie serif (Fraunces, Cormorant Garamond) pentru titluri, Inter pentru text util, JetBrains Mono pentru cifre și kickers
- Paletă neutră caldă: `#F5F1E8` (paper), `#1A1915` (ink), gri calcar pentru linii
- Culori vii doar pentru partide (roșu pentru PSD, galben pentru PNL etc.)
- Fără gradient-uri agresive, fără emoji-uri, fără animații distrase

Scopul e să pară că răsfoiești un almanah, nu un dashboard de analytics.

---

## 📚 Surse de date

- **Autoritatea Electorală Permanentă** — roaep.ro
- **Biroul Electoral Central** — bec.ro
- **Institutul Național de Statistică** — insse.ro
- **Wikipedia** (cu verificări încrucișate în Monitorul Oficial)

Valorile din `ELECTIONS` sunt pentru Camera Deputaților (convenția standard). Numărul de mandate include Camera + Senat.

---

## ⚖️ Licență

Codul e liber. Datele sunt publice (rezultate electorale oficiale).

Proiectul este neutru politic. Dacă găsești o eroare în date, deschide un issue.
