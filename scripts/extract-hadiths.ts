import * as fs from "fs";
import * as path from "path";

const ITEMS_DIR = path.join(__dirname, "..", "data", "items");

const C1_REGEX = /<span class="c1">([\s\S]*?)<\/span>/g;
const C4_REGEX = /<span class="c4">\[\s*(.*?)\s*\]<\/span>/;

const narratorIndicators = [
  "رواه",
  "متفق عليه",
  "متفقٌ عليه",
  "أخرجه",
  "أخرجة",
  "ورد في الأثر",
  "ورد في الاثر",
  "ورد وارد",
  "ورد في بعض الأثر",
  "ورد وارد في الصحيح",
];

const narratorNames = [
  "البخاري", "مسلم", "أبو داود", "أبو داوود", "الترمذي",
  "النسائي", "ابن ماجه", "ابن ماجة", "أحمد", "الدارمي",
  "مالك", "الحاكم", "البيهقي", "الطبراني", "ابن حبان",
  "ابن خزيمة", "الدارقطني", "الدراقطني", "البزار",
  "أبو يعلى", "ابن أبي شيبة", "عبد الرزاق", "ابن عساكر",
  "الديلمي", "الديلمى", "أبو الشيخ", "الخطيب", "ابن عدي",
  "ابن مردويه", "السيوطي", "الذهبي", "ابن حجر",
  "الألباني", "الأصبهاني", "الشيخان",
  "الحارث", "ابن أبي الدنيا", "الرفاعي",
  "البغوي", "الوادعي", "الأرناؤوط",
  "الجامع الصغير", "الترغيب والترهيب",
  "كنز العمال", "سنن ابن ماجه",
  "صحيح البخاري", "صحيح النسائي", "صحيح ابن ماجه",
  "مسند أحمد", "جامع الأصول",
  "سلسلة الأحاديث الضعيفة",
  "مختصر تفسير ابن كثير", "تفسير ابن كثير",
  "من كشف الخفاء", "ضعفاء العقيلي",
  "مشكاة المصابيح",
];

function isHadithReference(ref: string): boolean {
  const cleaned = ref.trim();
  for (const indicator of narratorIndicators) {
    if (cleaned.includes(indicator)) return true;
  }
  for (const name of narratorNames) {
    if (cleaned.includes(name)) return true;
  }
  return false;
}

function cleanHadithText(text: string): string {
  return text
    .replace(/<span class="c2">[\s\S]*?<\/span>/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/^[\s"«»"'']+|[\s"«»"'']+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForDedup(text: string): string {
  return text
    .replace(/[ًٌٍَُِّْ]|[\u064B-\u065F]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[«»""'']/g, "")
    .trim();
}

function isNearDuplicate(a: string, b: string): boolean {
  const na = normalizeForDedup(a);
  const nb = normalizeForDedup(b);
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;
  const shorter = na.length <= nb.length ? na : nb;
  const longer = na.length <= nb.length ? nb : na;
  if (shorter.length < 30) return false;
  if (longer.includes(shorter)) return true;
  return false;
}

function deduplicate(hadiths: string[]): string[] {
  const result: string[] = [];
  for (const h of hadiths) {
    let isDup = false;
    for (const existing of result) {
      if (isNearDuplicate(h, existing)) {
        isDup = true;
        break;
      }
    }
    if (!isDup) result.push(h);
  }
  return result;
}

interface FileInfo {
  file: string;
  index: number;
  hadiths: string[];
}

function extractAllWithSources(): { hadiths: string[]; sources: Map<string, string[]> } {
  const files = fs.readdirSync(ITEMS_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const hadithSet = new Map<string, string[]>();
  const sources = new Map<string, string[]>();

  function addHadith(text: string, file: string) {
    if (text.length <= 5 || /^\[[\s\S]{0,50}\]$/.test(text)) return;
    const existing = hadithSet.get(text);
    if (existing) {
      if (!existing.includes(file)) existing.push(file);
    } else {
      hadithSet.set(text, [file]);
    }
  }

  for (const file of files) {
    const item = JSON.parse(
      fs.readFileSync(path.join(ITEMS_DIR, file), "utf8")
    );

    const html = item.contentHtml;
    if (!html) continue;

    const c1Matches = [...html.matchAll(C1_REGEX)];

    for (let i = 0; i < c1Matches.length; i++) {
      const c1Content = c1Matches[i][0];
      const c1Inner = c1Matches[i][1];

      const afterC1 = html.slice(c1Matches[i].index! + c1Content.length);
      const c4Match = afterC1.match(C4_REGEX);
      const afterMatch = afterC1.match(C1_REGEX);

      const distanceToC4 = c4Match ? afterC1.indexOf(c4Match[0]) : -1;
      const distanceToNextC1 = afterMatch ? afterC1.indexOf(afterMatch[0]) : -1;

      const hasAdjacentC4 = distanceToC4 >= 0 && (
        distanceToNextC1 < 0 || distanceToC4 < distanceToNextC1
      );

      if (hasAdjacentC4) {
        const refText = c4Match![1];
        if (isHadithReference(refText)) {
          const cleaned = cleanHadithText(c1Inner);
          addHadith(cleaned, file);
        }
      }
    }

    const content = item.content;
    if (content) {
      const inlinePatterns = [
        /(?:عَنْ\s+[^:]+:\s*)?قَالَ\s+رَسُولُ\s+اللَّهِ\s*(?:صَلَّى\s+اللَّهُ\s+عَلَيْهِ\s+وَسَلَّمَ)?\s*:\s*[""']?\s*([^""'"]+?)\s*[""']?/g,
        /(?:عَنْ\s+[^:]+:\s*)?قَالَ\s+رَسُولُ\s+الله\s*(?:صَلَّى\s+اللَّهُ\s+عَلَيْهِ\s+وَسَلَّمَ)?\s*:\s*[""']?\s*([^""'"]+?)\s*[""']?/g,
      ];

      for (const pattern of inlinePatterns) {
        const matches = [...content.matchAll(pattern)];
        for (const match of matches) {
          let text = match[1].replace(/\s+/g, " ").trim();
          if (text.length > 10 && text.length < 1000) {
            if (text.startsWith("[")) continue;
            const inHtml = html.includes(
              text.substring(0, 50).replace(/"/g, "&quot;")
            );
            if (!inHtml) {
              addHadith(text, file);
            }
          }
        }
      }
    }
  }

  const hadiths = [...hadithSet.keys()];
  for (const h of hadiths) {
    sources.set(h, hadithSet.get(h)!);
  }

  return { hadiths, sources };
}

function analyzeDistribution(
  hadiths: string[],
  sources: Map<string, string[]>
): void {
  const lectureCounts = new Map<string, { total: number; unique: number }>();

  for (const file of fs.readdirSync(ITEMS_DIR).filter(f => f.endsWith(".json")).sort()) {
    const item = JSON.parse(
      fs.readFileSync(path.join(ITEMS_DIR, file), "utf8")
    );
    const title = item.title || file;
    lectureCounts.set(file, { total: 0, unique: 0 });
  }

  const lectureHadithCount = new Map<string, number>();
  for (const file of fs.readdirSync(ITEMS_DIR).filter(f => f.endsWith(".json")).sort()) {
    lectureHadithCount.set(file, 0);
  }

  for (const [h, srcs] of sources) {
    const cleanedH = cleanHadithText(h);
    if (cleanedH.length <= 5 || /^\[[\s\S]{0,50}\]$/.test(cleanedH)) continue;
    const dedupKey = normalizeForDedup(cleanedH);
    let found = false;
    for (const existing of hadiths) {
      if (normalizeForDedup(existing) === dedupKey) {
        found = true;
        break;
      }
    }
    if (found) {
      for (const src of srcs) {
        lectureHadithCount.set(src, (lectureHadithCount.get(src) || 0) + 1);
      }
    }
  }

  console.log("=== التوزيع عبر المحاضرات ===");
  console.log("");
  const sortedEntries = [...lectureHadithCount.entries()].sort((a, b) => b[1] - a[1]);
  for (const [file, count] of sortedEntries) {
    if (count > 0) {
      const item = JSON.parse(
        fs.readFileSync(path.join(ITEMS_DIR, file), "utf8")
      );
      console.log(`${count.toString().padStart(3)}  ${item.title || file}`);
    }
  }
  console.log("");
  console.log(`إجمالي الأحاديث الفريدة بعد إزالة التشابه: ${hadiths.length}`);
}

function main() {
  const { hadiths: rawHadiths, sources } = extractAllWithSources();

  const cleanedHadiths = rawHadiths
    .map((h) => cleanHadithText(h))
    .filter((h) => h.length > 5 && !/^\[[\s\S]{0,50}\]$/.test(h));

  console.log(`عدد الأحاديث الخام: ${cleanedHadiths.length}`);
  console.log("");

  const deduped = deduplicate(cleanedHadiths);
  console.log(`عدد الأحاديث بعد إزالة التشابه: ${deduped.length}`);
  console.log(`تمت إزالة ${cleanedHadiths.length - deduped.length} حديثاً مكرراً`);
  console.log("");

  analyzeDistribution(deduped, sources);
  console.log("");

  const outputPath = path.join(__dirname, "..", "data", "hadiths.json");
  fs.writeFileSync(outputPath, JSON.stringify(deduped, null, 2), "utf8");
  console.log(`تم حفظ الأحاديث إلى: ${outputPath}`);
  console.log("");

  console.log("=== الأحاديث النهائية (JSON Array) ===");
  console.log(JSON.stringify(deduped, null, 2));
}

main();
