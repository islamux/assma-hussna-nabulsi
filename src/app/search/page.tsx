"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Fuse from "fuse.js";

interface SearchItem {
  name: string;
  slug: string;
  content: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<{ name: string; slug: string; snippet: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    fetch("/data/search-index.json")
      .then((r) => {
        if (!r.ok) throw new Error("فشل تحميل فهرس البحث");
        return r.json();
      })
      .then((data: SearchItem[]) => {
        const fuse = new Fuse(data, {
          keys: ["name", "content"],
          threshold: 0.3,
          includeMatches: true,
          minMatchCharLength: 2,
        });
        const res = fuse.search(query).slice(0, 20).map((r) => ({
          name: r.item.name,
          slug: r.item.slug,
          snippet: r.item.content.substring(0, 200) + "...",
        }));
        setResults(res);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع"))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-primary mb-6 font-heading">
        نتائج البحث: {query}
      </h1>

      {loading && <p className="text-muted">جاري البحث...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && results.length === 0 && query && (
        <p className="text-muted">لا توجد نتائج لـ &quot;{query}&quot;</p>
      )}

      <div className="space-y-4">
        {results.map((r) => (
          <Link
            key={r.slug}
            href={`/asma/${r.slug}`}
            className="block p-5 rounded-xl border border-border bg-card hover:bg-card-hover hover:border-primary/30 transition-all"
          >
            <h3 className="text-lg font-bold text-primary font-heading">
              اسم الله {r.name}
            </h3>
            <p className="mt-2 text-sm text-muted/80 line-clamp-2">{r.snippet}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <SearchBar />
        </div>
        <Suspense fallback={<p className="text-center text-muted py-12">جاري التحميل...</p>}>
          <SearchResults />
        </Suspense>
      </main>
    </>
  );
}
