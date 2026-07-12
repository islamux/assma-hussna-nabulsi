"use client";

import { useSettings } from "@/lib/settings-context";

export default function FontSizeControl() {
  const { fontSize, increaseFontSize, decreaseFontSize } = useSettings();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={decreaseFontSize}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-card-hover transition-colors text-sm font-bold"
        title="تصغير الخط"
      >
        A-
      </button>
      <span className="text-xs text-muted w-6 text-center">{fontSize}</span>
      <button
        onClick={increaseFontSize}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-card-hover transition-colors text-lg font-bold"
        title="تكبير الخط"
      >
        A+
      </button>
    </div>
  );
}
