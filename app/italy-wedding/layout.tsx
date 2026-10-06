import type { Metadata } from "next";
import Link from "next/link";
import { Monsieur_La_Doulaise, Libre_Baskerville, Cormorant_Garamond } from "next/font/google";
import { ItalyNav } from "@/components/italy/ItalyNav";
import { ITALY } from "@/lib/italy-content";

/*
 * /italy-wedding typography (Pinyon Script comes from the root layout):
 *  flourish — Monsieur La Doulaise: the names, hero script, monogram
 *  display  — Pinyon Script: section titles
 *  caps     — Libre Baskerville: tracked uppercase nav/labels
 *  body     — Cormorant Garamond 300: running text
 */
const monsieur = Monsieur_La_Doulaise({
  variable: "--font-monsieur",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["300", "400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Meryl & John · Todi, Umbria",
    template: "%s · Meryl & John in Todi",
  },
  description:
    "Meryl & John are getting married April 21–23, 2027 at the Monastero Santa Margherita in Todi, Umbria.",
};

export default function ItalyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${monsieur.variable} ${baskerville.variable} ${cormorant.variable} theme-italy flex min-h-screen flex-1 flex-col overflow-x-clip bg-ivory font-body text-ink`}
    >
      <div aria-hidden="true" className="italy-grain" />

      <header className="flex flex-col items-center gap-[18px] px-4 pt-[46px] pb-[34px]">
        <Link
          href="/italy-wedding"
          className="text-center font-flourish text-[clamp(46px,7.4vw,78px)] leading-[1.24] text-ink"
        >
          {ITALY.names}
        </Link>
        <ItalyNav />
      </header>

      <main className="flex-1">{children}</main>

      <footer className="flex flex-col items-center gap-2.5 px-4 pt-[70px] pb-[84px]">
        <p className="pb-[0.3em] font-flourish text-[clamp(64px,9vw,120px)] leading-none text-ink">
          {ITALY.monogram}
        </p>
        <p className="font-caps text-[10px] uppercase tracking-[0.24em] text-ink-soft">
          {ITALY.footerLine}
        </p>
        {/* Required by the Vecteezy free license — see public/italy/CREDITS.md */}
        <a
          href="https://www.vecteezy.com/free-vector/doodle"
          className="mt-6 font-body text-[13px] text-ink-soft/70 underline-offset-4 hover:underline"
        >
          Illustrations by Vecteezy
        </a>
      </footer>
    </div>
  );
}
