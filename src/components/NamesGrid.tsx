"use client";

import { useState } from "react";
import NameCard from "./NameCard";
import SearchBar from "./SearchBar";
import type { NameEntry } from "@/lib/types";

export default function NamesGrid({ names }: { names: NameEntry[] }) {
  const [filter, setFilter] = useState("");

  const filtered = filter
    ? names.filter((n) => n.name.includes(filter) || n.displayName.includes(filter))
    : names;

  return (
    <div>
      <div className="flex justify-center mb-8">
        <SearchBar />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((name) => (
          <NameCard
            key={name.slug}
            slug={name.slug}
            name={name.name}
            displayName={name.displayName}
            partsCount={name.parts.length}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted py-12">لا توجد نتائج</p>
      )}
    </div>
  );
}
