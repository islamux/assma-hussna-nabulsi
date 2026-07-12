import type { Metadata } from "next";
import { Amiri, Noto_Naskh_Arabic } from "next/font/google";
import { SettingsProvider } from "@/lib/settings-context";
import "./globals.css";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "أسماء الله الحسنى | الدكتور محمد راتب النابلسي",
  description: "موسوعة أسماء الله الحسنى وشرحها للدكتور محمد راتب النابلسي - الكلم الطيب",
  keywords: "أسماء الله الحسنى, أسماء الله, الدكتور محمد راتب النابلسي, الكلم الطيب, الإسلام, القرآن",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${notoNaskh.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontSize: "var(--font-size-base, 18px)" }}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
