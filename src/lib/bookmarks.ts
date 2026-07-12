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
  if (!bookmarks.includes(slug)) {
    bookmarks.push(slug);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(slug: string): void {
  const bookmarks = getBookmarks().filter((s) => s !== slug);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export function isBookmarked(slug: string): boolean {
  return getBookmarks().includes(slug);
}
