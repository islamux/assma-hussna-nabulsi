import * as fs from "fs";
import * as path from "path";

const ITEMS_DIR = path.join(__dirname, "..", "data", "items");
const OUTPUT = path.join(__dirname, "..", "data", "names.json");
const SEARCH_OUTPUT = path.join(__dirname, "..", "data", "search-index.json");

interface RawItem {
  index: number;
  id: string;
  meta: { title: string; description: string };
  content: string;
  contentHtml: string;
}

// Parse "اسم الله X 1" → name: "الرحمن", part: 1
function parseName(title: string): { name: string; part: number } {
  const clean = title.replace(/[:؟؟،،]/g, "").trim();

  // Handle "مقدمة" entries specially
  if (clean.startsWith("مقدمة")) {
    const partMatch = clean.match(/مقدمة\s+(\d+)/);
    return { name: "المقدمة", part: partMatch ? parseInt(partMatch[1]) : 1 };
  }

  let name = clean.replace(/^اسم\s+الله\s+/, "").trim();
  const partMatch = name.match(/\s+(\d+)$/);
  let part = 1;
  if (partMatch) {
    part = parseInt(partMatch[1]);
    name = name.replace(/\s+\d+$/, "").trim();
  }
  return { name, part };
}

function slugify(name: string): string {
  return name.replace(/\s+/g, "-").replace(/[^\u0600-\u06FF\-]/g, "");
}

function main() {
  const files = fs.readdirSync(ITEMS_DIR).filter((f) => f.endsWith(".json")).sort();
  const rawItems: RawItem[] = files.map((f) => JSON.parse(fs.readFileSync(path.join(ITEMS_DIR, f), "utf8")));

  // Group by name
  const grouped = new Map<string, { displayName: string; parts: RawItem[] }>();

  for (const item of rawItems) {
    const { name, part } = parseName(item.meta.title);
    if (!grouped.has(name)) {
      grouped.set(name, { displayName: name, parts: [] });
    }
    grouped.get(name)!.parts.push(item);
  }

  // Sort parts within each group
  for (const [, group] of grouped) {
    group.parts.sort((a, b) => {
      const pa = parseName(a.meta.title).part;
      const pb = parseName(b.meta.title).part;
      return pa - pb;
    });
  }

  // Build output array
  const names = Array.from(grouped.entries())
    .map(([name, group], i) => ({
      index: i + 1,
      slug: slugify(name),
      name,
      displayName: name === "المقدمة" ? "مقدمة: مكانة أسماء الله الحسنى في الدعوة" : `اسم الله ${name}`,
      parts: group.parts.map((p) => ({
        index: p.index,
        title: p.meta.title,
        content: p.content,
        contentHtml: p.contentHtml,
      })),
    }))
    .sort((a, b) => a.index - b.index);

  fs.writeFileSync(OUTPUT, JSON.stringify(names, null, 2), "utf8");

  // Build search index
  const searchIndex = names.map((n) => ({
    name: n.name,
    slug: n.slug,
    content: n.parts.map((p) => p.content).join("\n"),
  }));
  fs.writeFileSync(SEARCH_OUTPUT, JSON.stringify(searchIndex, null, 2), "utf8");

  // Copy search index to public directory for client-side fetching
  const publicSearchDir = path.join(__dirname, "..", "public", "data");
  if (!fs.existsSync(publicSearchDir)) fs.mkdirSync(publicSearchDir, { recursive: true });
  fs.writeFileSync(path.join(publicSearchDir, "search-index.json"), JSON.stringify(searchIndex, null, 2), "utf8");

  console.log(`Grouped ${rawItems.length} items → ${names.length} unique names`);
  console.log(`Saved: ${OUTPUT}`);
  console.log(`Search index: ${SEARCH_OUTPUT} + public/data/search-index.json`);
  names.forEach((n) => console.log(`  ${n.index}. ${n.displayName} (${n.parts.length} parts) → /asma/${n.slug}`));
}

main();
