import { notFound } from "next/navigation";
import { getAllNames, getNameBySlug, getPrevNext } from "@/lib/data";
import Header from "@/components/Header";
import ArticleReader from "@/components/ArticleReader";
import NavigationArrows from "@/components/NavigationArrows";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButton from "@/components/ShareButton";

export async function generateStaticParams() {
  const names = getAllNames();
  return names.map((name) => ({ slug: name.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = getNameBySlug(slug);
  if (!name) return {};
  return {
    title: `${name.displayName} | أسماء الله الحسنى`,
    description: `شرح ${name.displayName} للدكتور محمد راتب النابلسي`,
  };
}

export default async function NamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = getNameBySlug(slug);
  if (!name) notFound();

  const { prev, next } = getPrevNext(slug);

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary font-heading">
              {name.displayName}
            </h1>
            <div className="flex items-center gap-1">
              <BookmarkButton slug={slug} />
              <ShareButton slug={slug} name={name.displayName} />
            </div>
          </div>

          {name.parts.length > 1 && (
            <div className="flex gap-2 mb-8">
              {name.parts.map((_, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  الجزء {i + 1}
                </span>
              ))}
            </div>
          )}

          <ArticleReader parts={name.parts} />

          <NavigationArrows prev={prev} next={next} />
        </article>
      </main>
    </>
  );
}
