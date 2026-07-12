"use client";

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" method="get" className="w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          name="q"
          defaultValue={defaultValue}
          placeholder="ابحث عن اسم من أسماء الله الحسنى..."
          className="w-full px-5 py-3 pr-12 rounded-xl border border-border bg-card text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          dir="rtl"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
