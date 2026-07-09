# NudiCodex

A "Pokédex" for nudibranchs and sea slugs. Browse a catalogue of the ocean's most
extravagant animals, read a clean field entry for each one, and track how many
species you've logged across the world's dive regions.

<img src="docs/screenshot-dex.png" alt="NudiCodex grid of sea slug species" width="480" />

## What it does

- **Codex grid** — every species as a numbered card with its photo, names and region tags.
- **Search & filter** — instant text search plus filters by taxonomic family and ocean region.
- **Species entries** — each entry has a specimen readout (size, depth, water temperature,
  order), taxonomy, "how to identify" field marks, habitat, diet, distribution and a fun fact.
- **One-tap logging** — tick any species straight from its grid card (no need to open the
  page); it's recorded against the species' main region, which you can refine on the detail page.
- **Region tracker** — mark a species as seen and record which region you saw it in. A
  progress page shows per-region completion and your overall codex percentage.
- **Achievements** — nineteen milestone badges that unlock as you collect: count goals
  (1/5/10/25/50/75/all logged), region goals (a sighting in every region, completing one or every
  region), taxonomy goals (all three orders, 12 and 20 families, 10 chromodorids), and trait goals
  (a giant, a tiny species, a deep-water one, a sacoglossan, a cold-water one).
- **Offline-first** — ships with a curated 94-species dataset and needs no backend to run.
  Your collection persists in the browser via localStorage.

## Tech stack

React 18 · TypeScript (strict) · Vite · React Router · TanStack Query · Zustand · Recharts.

## Quick start

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

### Checks

```bash
cd frontend
npm run type-check
npm run lint
npm run build
```

## Project structure

```
NudiCodex/
├── frontend/              # The NudiCodex app (React + TypeScript)
│   └── src/
│       ├── data/          # species.ts dataset, regions, image attribution
│       ├── pages/         # DexGrid, SpeciesDetail, Progress, NotFound
│       ├── components/    # Cards, filter bar, specimen readout, progress ring…
│       ├── store/         # collectionStore — persisted "seen" tracking
│       ├── services/      # Data layer (Promise-based; API-swappable)
│       └── hooks/         # TanStack Query hooks
├── backend/               # FastAPI scaffold (optional, for a future species API)
├── infrastructure/        # Docker / deployment configs
└── data/                  # ML assets (future image-identification work)
```

## Data & credits

Species summaries are original text; taxonomy follows the World Register of Marine
Species (WoRMS). Photographs are from **Wikimedia Commons** under the Creative Commons
licences credited on each entry and listed in
[`frontend/src/data/attribution.md`](frontend/src/data/attribution.md). Reference for
species content: [Sea Slugs of the World](https://en.seaslug.world/).

## Extending the codex

Add a species by appending an entry to `frontend/src/data/species.ts` (give it the next
`dexNumber`, tag its `regions`, and add the image credit to `attribution.md`). The data
service is Promise-based and mirrors a REST client, so it can later be pointed at the
FastAPI backend by swapping `nudibranch.service.ts` — no component changes needed.
