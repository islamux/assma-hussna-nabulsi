# Development Guide — For Junior Developers

This guide explains how this project works, step by step, assuming you have no prior React or Next.js experience.

## Table of Contents

1. [What Is This Project?](#1-what-is-this-project)
2. [Prerequisites](#2-prerequisites)
3. [How to Run the Project](#3-how-to-run-the-project)
4. [Key Concepts](#4-key-concepts)
5. [Project Structure Explained](#5-project-structure-explained)
6. [How Each File Works](#6-how-each-file-works)
7. [How to Make Changes](#7-how-to-make-changes)
8. [Common Tasks](#8-common-tasks)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. What Is This Project?

This is a **website** that displays 100 names of Allah with detailed explanations in Arabic. Think of it like a digital book where:

- The **homepage** shows all 100 names as clickable cards
- Clicking a name opens a **detail page** with the full explanation
- You can **search** for any word across all content
- You can **bookmark** names to read later
- You can switch between **light and dark modes**
- You can **increase or decrease** the text size

The content comes from lectures by Dr. Muhammad Ratib Al-Nabulsi, scraped from kalemtayeb.com.

---

## 2. Prerequisites

Before you start, make sure you have:

- **Node.js** (version 18 or higher) — [Download here](https://nodejs.org)
- **pnpm** (package manager) — Install with: `npm install -g pnpm`
- **A code editor** — [VS Code](https://code.visualstudio.com) is recommended
- **A web browser** — Chrome, Firefox, or Edge

### How to check if you have them installed:

```bash
node --version    # Should show v18.x or higher
pnpm --version    # Should show a version number
```

---

## 3. How to Run the Project

### First time setup:

```bash
# 1. Install all dependencies ( libraries the project needs)
pnpm install

# 2. Start the development server
pnpm dev
```

### Then open your browser:

Go to **http://localhost:3000**

You should see the homepage with 100 name cards in Arabic.

### Other useful commands:

| Command | What it does | When to use it |
|---------|-------------|----------------|
| `pnpm dev` | Starts a local server that auto-updates when you edit files | During development |
| `pnpm build` | Creates a production-ready build | Before deploying |
| `pnpm start` | Starts the production build locally | To test the production version |
| `pnpm build-data` | Regenerates the data files from scraped articles | When source data changes |

---

## 4. Key Concepts

### What is React?

React is a JavaScript library for building user interfaces. Instead of writing HTML files, you write **components** — small, reusable pieces of UI.

Think of components like LEGO blocks. Each block (component) does one thing, and you combine them to build the whole page.

### What is Next.js?

Next.js is a framework built on top of React that adds:

- **File-based routing** — A file named `page.tsx` in a folder automatically becomes a URL
- **Static Site Generation (SSG)** — Pages are pre-built at compile time, making them very fast
- **Server Components** — Some components run on the server, not in the browser

### What is the App Router?

Next.js 13+ uses the "App Router" where pages live in the `src/app/` folder:

```
src/app/
├── page.tsx              → Becomes the homepage (URL: /)
├── search/page.tsx       → Becomes the search page (URL: /search)
├── bookmarks/page.tsx    → Becomes the bookmarks page (URL: /bookmarks)
└── asma/[slug]/page.tsx  → Becomes 100 dynamic pages (URL: /asma/alakrm, etc.)
```

The `[slug]` in brackets means it's a **dynamic route** — one file generates many pages. The `slug` variable changes for each name (e.g., `alakrm`, `alrhmn`).

### What is TailwindCSS?

TailwindCSS is a CSS framework where you style elements by adding class names directly in your HTML/JSX:

```html
<!-- Without Tailwind: you write custom CSS -->
<h1 class="title">Hello</h1>
<style>.title { color: green; font-size: 24px; }</style>

<!-- With Tailwind: classes are built-in -->
<h1 class="text-green-500 text-2xl">Hello</h1>
```

### What is TypeScript?

TypeScript is JavaScript with added type safety. Instead of:

```javascript
function add(a, b) { return a + b; }  // What type are a and b?
```

You write:

```typescript
function add(a: number, b: number): number { return a + b; }  // Clear!
```

This catches errors before you run the code.

---

## 5. Project Structure Explained

```
assma-hussna-nabulsi/
│
├── src/                        # All source code
│   ├── app/                    # Pages (URL routes)
│   │   ├── layout.tsx          # Root layout — wraps every page
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Global styles and theme
│   │   ├── asma/[slug]/        # Name detail pages
│   │   │   └── page.tsx        # One file generates 100 pages
│   │   ├── search/
│   │   │   └── page.tsx        # Search results page
│   │   └── bookmarks/
│   │       └── page.tsx        # Saved bookmarks page
│   │
│   ├── components/             # Reusable UI pieces
│   │   ├── Header.tsx          # Top navigation bar
│   │   ├── NamesGrid.tsx       # Grid of name cards
│   │   ├── NameCard.tsx        # Single name card
│   │   ├── ArticleReader.tsx   # Reads and displays article HTML
│   │   ├── BookmarkButton.tsx  # Heart/bookmark toggle
│   │   ├── ShareButton.tsx     # Share via Web Share API
│   │   ├── SearchBar.tsx       # Search input form
│   │   ├── ThemeToggle.tsx     # Light/dark mode switch
│   │   ├── FontSizeControl.tsx # A-/A+ font size buttons
│   │   ├── NavigationArrows.tsx# Previous/next name links
│   │   ├── Bismillah.tsx       # "بسم الله" header
│   │   └── PatternDivider.tsx  # Decorative separator
│   │
│   └── lib/                    # Utilities and data
│       ├── types.ts            # TypeScript interfaces
│       ├── data.ts             # Data loading functions
│       ├── bookmarks.ts        # localStorage bookmark functions
│       └── settings-context.tsx# Theme and font size state
│
├── data/                       # Generated data
│   ├── names.json              # 100 grouped names with content
│   ├── search-index.json       # Search index
│   └── items/                  # 190 raw scraped files (gitignored)
│
├── scripts/
│   └── build-data.ts           # Builds names.json from items/
│
├── public/                     # Static files served as-is
│   └── data/search-index.json  # Search index for client-side fetch
│
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── postcss.config.mjs          # TailwindCSS PostCSS config
└── next.config.ts              # Next.js configuration
```

---

## 6. How Each File Works

### `src/app/layout.tsx` — The Root Layout

This file wraps **every page** in the app. It:

1. Loads Arabic fonts (Amiri for headings, Noto Naskh Arabic for body)
2. Sets the HTML direction to RTL (right-to-left) for Arabic
3. Wraps children in `SettingsProvider` for theme/font state

```tsx
// This is what a component looks like:
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <SettingsProvider>
          {children}  {/* This is where each page's content goes */}
        </SettingsProvider>
      </body>
    </html>
  );
}
```

### `src/app/page.tsx` — The Homepage

This is a **Server Component** (no `"use client"` at the top). It:

1. Calls `getAllNames()` to load all 100 names from `data/names.json`
2. Renders the `<Header />`, `<Bismillah />`, and `<NamesGrid />` components

```tsx
export default function HomePage() {
  const names = getAllNames();  // Runs on the server
  return (
    <>
      <Header />
      <NamesGrid names={names} />
    </>
  );
}
```

### `src/app/asma/[slug]/page.tsx` — Name Detail Pages

This is the most important file. It generates **100 different pages** from one file.

The `[slug]` in the folder name means the URL parameter `slug` is passed to the component:

```tsx
// When someone visits /asma/alakrm:
// slug = "alakrm"

export default async function NamePage({ params }) {
  const { slug } = await params;
  const name = getNameBySlug(slug);  // Find "الأكرم" in names.json
  if (!name) notFound();  // Show 404 if not found

  return (
    <article>
      <h1>{name.displayName}</h1>
      <ArticleReader parts={name.parts} />
    </article>
  );
}
```

The `generateStaticParams()` function tells Next.js which pages to pre-build:

```tsx
export async function generateStaticParams() {
  const names = getAllNames();
  return names.map((name) => ({ slug: name.slug }));
  // Returns: [{slug: "almqdma"}, {slug: "alakrm"}, ...]
}
```

### `src/lib/types.ts` — TypeScript Interfaces

These define the shape of your data:

```typescript
interface NameEntry {
  index: number;       // Position in the list (1-100)
  slug: string;        // URL-safe identifier (e.g., "alakrm")
  name: string;        // Arabic name (e.g., "الأكرم")
  displayName: string; // Full display text (e.g., "اسم الله الأكرم")
  parts: NamePart[];   // Array of content parts
}

interface NamePart {
  index: number;
  title: string;
  content: string;      // Plain text
  contentHtml: string;  // HTML with formatting
}
```

### `src/lib/data.ts` — Data Loading

These functions load and query the data:

```typescript
// Get all 100 names
getAllNames(): NameEntry[]

// Find one name by its URL slug
getNameBySlug(slug: string): NameEntry | undefined

// Get previous and next names for navigation
getPrevNext(slug: string): { prev: NameEntry | null; next: NameEntry | null }
```

### `src/lib/settings-context.tsx` — React Context for State

This uses React's **Context API** to share theme and font size across all components:

```tsx
// The provider wraps the entire app
<SettingsProvider>
  {children}
</SettingsProvider>

// Any component can access the settings:
const { theme, toggleTheme, fontSize, increaseFontSize } = useSettings();
```

### `src/lib/bookmarks.ts` — localStorage Bookmarks

Bookmarks are saved in the browser's `localStorage` (persists between sessions):

```typescript
getBookmarks(): string[]        // Read all bookmarked slugs
addBookmark(slug: string)       // Add a bookmark
removeBookmark(slug: string)    // Remove a bookmark
isBookmarked(slug: string)      // Check if bookmarked
```

### `src/components/ArticleReader.tsx` — Displaying Content

This component renders the HTML content of each name. It uses `dangerouslySetInnerHTML` because the HTML is pre-sanitized at build time in `build-data.ts`:

```tsx
<div
  className="article"
  dangerouslySetInnerHTML={{ __html: part.contentHtml }}
/>
```

---

## 7. How to Make Changes

### Change the colors/theme

Edit `src/app/globals.css`. The color variables are defined in the `:root` (light) and `.dark` (dark) sections:

```css
:root {
  --primary: #0d4f3c;      /* Main green color */
  --accent: #c5a059;        /* Gold accent */
  --background: #faf8f3;    /* Page background */
  --foreground: #2d2a24;    /* Text color */
}
```

### Add a new page

1. Create a new folder in `src/app/` (e.g., `src/app/about/`)
2. Create a `page.tsx` inside it:

```tsx
export default function AboutPage() {
  return <h1>About Us</h1>;
}
```

3. The page is now available at `/about`

### Add a new component

1. Create a new file in `src/components/` (e.g., `src/components/Footer.tsx`)
2. Write your component:

```tsx
export default function Footer() {
  return <footer>© 2026 My App</footer>;
}
```

3. Import and use it in any page:

```tsx
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <main>...</main>
      <Footer />
    </>
  );
}
```

### Modify the data pipeline

Edit `scripts/build-data.ts` and run:

```bash
npx tsx scripts/build-data.ts
```

This regenerates `data/names.json` and `data/search-index.json`.

---

## 8. Common Tasks

### "How do I change the header text?"

Edit `src/components/Header.tsx` — find the `<Link>` element and change the text.

### "How do I add a new bookmark feature?"

The bookmark system is in `src/lib/bookmarks.ts`. It uses `localStorage`:

```typescript
// Save data:
localStorage.setItem("key", "value");

// Read data:
localStorage.getItem("key");  // Returns "value" or null

// Remove data:
localStorage.removeItem("key");
```

### "How does the search work?"

The search page (`src/app/search/page.tsx`) uses **Fuse.js** for fuzzy matching:

1. User types in the search bar → navigates to `/search?q=الرحمن`
2. `SearchResults` component fetches `search-index.json`
3. Fuse.js searches across names and content
4. Results are displayed as clickable cards

### "How do I deploy to Vercel?"

```bash
# Install Vercel CLI (one time)
npm install -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

---

## 9. Troubleshooting

### "I get a 404 on name pages"

Make sure you've built the data first:

```bash
npx tsx scripts/build-data.ts
pnpm build
```

### "The page is blank or has errors"

Check the browser console (F12 → Console tab) for error messages. Common causes:

- Missing dependencies: run `pnpm install`
- TypeScript errors: run `pnpm build` to see full error messages

### "TailwindCSS classes aren't working"

Make sure `postcss.config.mjs` exists and contains:

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### "Fonts aren't loading"

Arabic fonts are loaded from Google Fonts via `next/font` in `layout.tsx`. Check your internet connection.

### "The dev server is slow"

This is normal on first load. Next.js compiles pages on-demand. Subsequent visits to the same page are fast.

---

## Glossary

| Term | Meaning |
|------|---------|
| **Component** | A reusable piece of UI (like a LEGO block) |
| **Props** | Data passed to a component (like function arguments) |
| **State** | Data that changes over time within a component |
| **JSX** | HTML-like syntax used in React components |
| **SSG** | Static Site Generation — pages built at compile time |
| **SSR** | Server-Side Rendering — pages built on each request |
| **Client Component** | A component that runs in the browser (has `"use client"`) |
| **Server Component** | A component that runs on the server (default in Next.js) |
| **Hook** | A React function that starts with `use` (e.g., `useState`, `useEffect`) |
| **Slug** | A URL-safe version of a name (e.g., "الأكرم" → "alakrm") |
| **RTL** | Right-to-Left — the writing direction for Arabic/Hebrew |
| **TailwindCSS** | A CSS framework where you style via class names |
| **TypeScript** | JavaScript with added type safety |
| **localStorage** | Browser storage that persists between sessions |
