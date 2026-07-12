"use client";

import { useState, useEffect } from "react";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/bookmarks";

export default function BookmarkButton({ slug, name }: { slug: string; name: string }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(slug));
  }, [slug]);

  const toggle = () => {
    if (bookmarked) {
      removeBookmark(slug);
      setBookmarked(false);
    } else {
      addBookmark(slug);
      setBookmarked(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-lg transition-colors ${
        bookmarked ? "bg-accent/20 text-accent" : "hover:bg-card-hover text-muted"
      }`}
      title={bookmarked ? "إزالة من المفضلة" : "أضف للمفضلة"}
    >
      <svg className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
