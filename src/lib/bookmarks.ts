"use client";

const BOOKMARKS_KEY = "bookmarks";

export function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addBookmark(slug: string): void {
  const bookmarks = getBookmarks();
  if (bookmarks.includes(slug)) return;
  bookmarks.push(slug);
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch {
    // storage can be disabled or full; bookmark silently not persisted
  }
}

export function removeBookmark(slug: string): void {
  const bookmarks = getBookmarks().filter((s) => s !== slug);
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch {
    // storage can be disabled or full; removal silently not persisted
  }
}

export function isBookmarked(slug: string): boolean {
  return getBookmarks().includes(slug);
}
