"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import FontSizeControl from "./FontSizeControl";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-primary font-heading">
            أسماء الله الحسنى
          </Link>
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
            <FontSizeControl />
          </div>
        </div>
      </div>
    </header>
  );
}
