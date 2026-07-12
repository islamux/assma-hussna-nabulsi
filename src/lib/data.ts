import namesData from "@/../data/names.json";
import searchIndex from "@/../data/search-index.json";
import type { NameEntry, SearchEntry } from "./types";

export function getAllNames(): NameEntry[] {
  return namesData as NameEntry[];
}

export function getNameBySlug(slug: string): NameEntry | undefined {
  return getAllNames().find((n) => n.slug === slug);
}

export function getSearchIndex(): SearchEntry[] {
  return searchIndex as SearchEntry[];
}

export function getTotalNames(): number {
  return getAllNames().length;
}

export function getPrevNext(slug: string) {
  const names = getAllNames();
  const idx = names.findIndex((n) => n.slug === slug);
  return {
    prev: idx > 0 ? names[idx - 1] : null,
    next: idx < names.length - 1 ? names[idx + 1] : null,
  };
}
