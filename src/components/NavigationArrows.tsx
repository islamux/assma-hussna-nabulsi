"use client";

import Link from "next/link";

interface NavArrowsProps {
  prev: { slug: string; displayName: string } | null;
  next: { slug: string; displayName: string } | null;
}

export default function NavigationArrows({ prev, next }: NavArrowsProps) {
  return (
    <div className="flex justify-between items-center py-8 border-t border-border">
      {prev ? (
        <Link
          href={`/asma/${prev.slug}`}
          className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors group"
        >
          <svg className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sm">{prev.displayName}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/asma/${next.slug}`}
          className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors group"
        >
          <span className="text-sm">{next.displayName}</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
