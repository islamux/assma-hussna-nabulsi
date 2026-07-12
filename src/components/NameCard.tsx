import Link from "next/link";

interface NameCardProps {
  slug: string;
  name: string;
  displayName: string;
  partsCount: number;
}

export default function NameCard({ slug, name, displayName, partsCount }: NameCardProps) {
  return (
    <Link
      href={`/asma/${slug}`}
      className="group block p-6 rounded-2xl border border-border bg-card hover:bg-card-hover hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold text-primary group-hover:text-primary-light transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
          {name}
        </h3>
        <p className="mt-2 text-sm text-muted">{displayName}</p>
        {partsCount > 1 && (
          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
            {partsCount} أجزاء
          </span>
        )}
      </div>
    </Link>
  );
}
