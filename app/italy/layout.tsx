import type { Metadata } from "next";
import Link from "next/link";
import { Libre_Baskerville, Cormorant_Garamond } from "next/font/google";
import { ItalyNav } from "@/components/italy/ItalyNav";
import { ITALY } from "@/lib/italy-content";

/*
 * /italy typography (Pinyon Script comes from the root layout):
 *  flourish — Pinyon Script: the names, hero script, monogram
 *  display  — Pinyon Script: section titles
 *  caps     — Libre Baskerville: tracked uppercase nav/labels
 *  body     — Cormorant Garamond 300: running text
 *
 * flourish and display are the same face now — they were Monsieur La Doulaise
 * and Pinyon respectively, until the Italy side was brought onto the same
 * script as the church save-the-date. Kept as two tokens because they mark
 * different intents (the couple's mark vs. a section head) and may diverge
 * again; nothing is loaded twice for it.
 */
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
      className={`${baskerville.variable} ${cormorant.variable} theme-italy linen flex min-h-screen flex-1 flex-col overflow-x-clip bg-ivory font-body text-ink`}
    >
      {/* Header and footer are the deep half of the two-tone ground — the same
          rails the stationery reads as. linen-dark flips the weave to
          soft-light so it lifts out of the band instead of muddying it. */}
      <header className="linen linen-dark flex flex-col items-center gap-[18px] bg-[var(--color-band)] px-4 pt-[46px] pb-[34px] text-[var(--color-band-ink)]">
        <Link
          href="/italy"
          className="text-center font-flourish text-[clamp(40px,6.4vw,66px)] leading-[1.12] text-[var(--color-band-ink)]"
        >
          {ITALY.names}
        </Link>
        <ItalyNav />
      </header>

      <main className="flex-1">{children}</main>

      <footer className="linen linen-dark mt-[70px] flex flex-col items-center gap-2.5 bg-[var(--color-band)] px-4 pt-[70px] pb-[84px]">
        {/* pb clears the script's descender — Pinyon's is shallower than the
            Monsieur this was tuned for, so it needs about half the old 0.3em. */}
        <p className="pb-[0.14em] font-flourish text-[clamp(54px,7.4vw,96px)] leading-none text-[var(--color-band-ink)]">
          {ITALY.monogram}
        </p>
        <p className="font-caps text-[10px] uppercase tracking-[0.24em] text-[var(--color-band-ink-soft)]">
          {ITALY.footerLine}
        </p>
        {/* Required by the Vecteezy free license — see public/italy/CREDITS.md */}
        <a
          href="https://www.vecteezy.com/free-vector/doodle"
          className="mt-6 font-body text-[13px] text-[var(--color-band-ink-soft)] underline-offset-4 hover:underline"
        >
          Illustrations by Vecteezy
        </a>
      </footer>
    </div>
  );
}
