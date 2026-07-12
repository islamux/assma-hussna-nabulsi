"use client";

export default function ShareButton({ slug, name }: { slug: string; name: string }) {
  const share = async () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/asma/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("تم نسخ الرابط");
    }
  };

  return (
    <button
      onClick={share}
      className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted"
      title="مشاركة"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    </button>
  );
}
