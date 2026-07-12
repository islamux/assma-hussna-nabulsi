# أسماء الله الحسنى — Names of Allah Encyclopedia

An Arabic-language web application displaying 100 grouped names of Allah (Asma Allah Al-Husna) with detailed explanations from Dr. Muhammad Ratib Al-Nabulsi's lectures on [kalemtayeb.com](https://kalemtayeb.com/safahat/sub/2260).

## Tech Stack

- **Framework:** Next.js 16 (App Router, Static Site Generation)
- **UI:** React 19, TailwindCSS 4
- **Language:** TypeScript 5.8
- **Search:** Fuse.js (client-side fuzzy search)
- **Fonts:** Amiri (headings), Noto Naskh Arabic (body)
- **Package Manager:** pnpm

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (Turbopack) |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm build-data` | Regenerate `data/names.json` and search index from scraped articles |

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage — names gallery
│   │   ├── layout.tsx          # Root layout — RTL, fonts, theme provider
│   │   ├── globals.css         # TailwindCSS theme, Arabic typography
│   │   ├── asma/[slug]/        # Dynamic name detail pages (100 pages)
│   │   ├── search/             # Search page (Fuse.js)
│   │   └── bookmarks/          # Bookmarks page (localStorage)
│   ├── components/             # Reusable UI components
│   └── lib/                    # Utilities, types, data loading
├── data/
│   ├── items/                  # 190 raw scraped JSON articles (gitignored)
│   ├── names.json              # 100 grouped names (generated)
│   └── search-index.json       # Search index (generated)
├── scripts/
│   └── build-data.ts           # Data pipeline: items → names.json
└── public/data/                # Static assets served by Next.js
```

## Architecture

```
190 scraped articles (data/items/*.json)
        │
        ▼
  scripts/build-data.ts  ← groups by name, sanitizes HTML
        │
        ▼
  data/names.json + data/search-index.json
        │
        ▼
  src/lib/data.ts  ← server-side data loading
        │
        ▼
  Next.js SSG  ← pre-renders 100 name pages at build time
        │
        ▼
  Static HTML served to browsers
```

## Features

- **100 pre-rendered name pages** with full Arabic content
- **Light/dark theme** with system preference detection
- **Adjustable font size** (14px–28px)
- **Fuzzy search** across all names and content
- **Bookmarks** saved in localStorage
- **Share** via Web Share API or clipboard copy
- **RTL layout** with proper Arabic typography
- **Responsive design** — mobile to desktop

## Data Pipeline

The content is sourced from 190 lecture transcripts by Dr. Al-Nabulsi. The `build-data.ts` script:

1. Reads all JSON files from `data/items/`
2. Groups articles by name (e.g., "اسم الله الأكرم 1" + "اسم الله الأكرم 2" → "الأكرم")
3. Sorts parts within each group
4. Sanitizes HTML content (strips scripts, event handlers)
5. Generates ASCII-safe slugs for URL routing
6. Outputs `names.json` (app data) and `search-index.json` (search)

## Deployment

### Vercel (recommended)

```bash
vercel --prod
```

The project is configured for static export. All pages are pre-rendered at build time.

### Manual

```bash
pnpm build
pnpm start
```

## License

Content: Dr. Muhammad Ratib Al-Nabulsi / [kalemtayeb.com](https://kalemtayeb.com)
Application code: MIT
