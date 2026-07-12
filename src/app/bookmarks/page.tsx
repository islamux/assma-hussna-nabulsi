"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { getBookmarks, removeBookmark } from "@/lib/bookmarks";
import { getAllNames } from "@/lib/data";

export default function BookmarksPage() {
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBookmarkedSlugs(getBookmarks());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Header />
        <main className="flex-1 text-center py-12 text-muted">جاري التحميل...</main>
      </>
    );
  }

  const allNames = getAllNames();
  const bookmarked = allNames.filter((n) => bookmarkedSlugs.includes(n.slug));

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-2xl font-bold text-primary mb-8" style={{ fontFamily: "var(--font-heading)" }}>
            المفضلة
          </h1>

          {bookmarked.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted text-lg">لا توجد عناصر مفضلة بعد</p>
              <Link href="/" className="inline-block mt-4 text-primary hover:text-primary-light transition-colors">
                تصفح الأسماء
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarked.map((name) => (
                <div
                  key={name.slug}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-card-hover transition-all"
                >
                  <Link href={`/asma/${name.slug}`} className="flex-1">
                    <h3 className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                      {name.displayName}
                    </h3>
                    <p className="text-sm text-muted mt-1">{name.parts.length} أجزاء</p>
                  </Link>
                  <button
                    onClick={() => {
                      removeBookmark(name.slug);
                      setBookmarkedSlugs((s) => s.filter((slug) => slug !== name.slug));
                    }}
                    className="p-2 text-muted hover:text-red-500 transition-colors"
                    title="إزالة من المفضلة"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
