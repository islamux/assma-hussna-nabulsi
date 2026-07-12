"use client";

import NameCard from "./NameCard";
import SearchBar from "./SearchBar";
import type { NameEntry } from "@/lib/types";

export default function NamesGrid({ names }: { names: NameEntry[] }) {
  return (
    <div>
      <div className="flex justify-center mb-8">
        <SearchBar />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {names.map((name) => (
          <NameCard
            key={name.slug}
            slug={name.slug}
            name={name.name}
            displayName={name.displayName}
            partsCount={name.parts.length}
          />
        ))}
      </div>
    </div>
  );
}
