import { getAllNames } from "@/lib/data";
import Header from "@/components/Header";
import Bismillah from "@/components/Bismillah";
import NamesGrid from "@/components/NamesGrid";

export default function HomePage() {
  const names = getAllNames();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Bismillah />
            <div className="text-center mt-8 mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                أسماء الله الحسنى
              </h1>
              <p className="mt-3 text-muted text-lg">
                للدكتور محمد راتب النابلسي
              </p>
              <p className="mt-1 text-muted/70 text-sm">
                {names.length} اسمًا من أسماء الله الحسنى
              </p>
            </div>
            <NamesGrid names={names} />
          </div>
        </section>
      </main>
      <footer className="py-8 border-t border-border text-center text-muted text-sm">
        <p>الكلم الطيب - kalemtayeb.com</p>
      </footer>
    </>
  );
}
