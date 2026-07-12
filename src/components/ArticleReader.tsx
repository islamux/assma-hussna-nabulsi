"use client";

import { useSettings } from "@/lib/settings-context";

interface ArticleReaderProps {
  parts: { title: string; contentHtml: string }[];
}

export default function ArticleReader({ parts }: ArticleReaderProps) {
  const { fontSize } = useSettings();

  return (
    <div style={{ fontSize: `${fontSize}px` }} className="leading-relaxed">
      {parts.map((part, i) => (
        <div key={i} className={i > 0 ? "mt-12" : ""}>
          {parts.length > 1 && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-accent/40 rotate-45" />
                <div className="w-1.5 h-1.5 bg-accent/60 rotate-45" />
                <div className="w-1.5 h-1.5 bg-accent/40 rotate-45" />
              </div>
              <h3 className="text-lg font-bold text-primary font-heading">
                الجزء {i + 1}
              </h3>
              <div className="flex-1 h-[1px] bg-border" />
            </div>
          )}
          <div
            className="article text-foreground/90"
            dangerouslySetInnerHTML={{ __html: part.contentHtml }}
          />
        </div>
      ))}
    </div>
  );
}
