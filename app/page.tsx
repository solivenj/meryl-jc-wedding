import type { Metadata } from "next";
import Link from "next/link";
import { GateForm } from "@/components/gate/GateForm";
import { COUPLE } from "@/lib/content";
import { GATE_COOKIE, SECTION_HOME, grantedSections } from "@/lib/site-gate";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Meryl & John",
  robots: { index: false, follow: false },
};

/*
 * The front door for both weddings.
 *
 * It gives nothing away: no place, no date, no photograph, and no hint that
 * more than one word exists. A guest who holds a second word simply types it
 * into the same field. Built on the root tokens (Pinyon / Jost / EB Garamond
 * on #f6f1e8) rather than either site's theme — it is shared ground, so it
 * commits to neither, and with no imagery it stays the fastest page here.
 */
export default async function GatePage({
  searchParams,
}: {
  // A Promise in this version of Next — await before reading.
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const granted = grantedSections((await cookies()).get(GATE_COOKIE)?.value);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 py-16 text-center">
      <h1 className="font-display leading-[1.15] text-ink text-[clamp(50px,10vw,92px)]">
        {COUPLE.first}
        <span aria-hidden className="mx-1.5 inline-block align-middle text-[1.25em] leading-none">
          &amp;
        </span>
        <span className="sr-only">and</span>
        {COUPLE.second}
      </h1>

      <span aria-hidden="true" className="mt-8 block h-px w-[52px] bg-ink/35" />

      <p className="mt-7 font-utility text-[11px] uppercase tracking-[0.22em] text-ink-soft">
        The word on your invitation
      </p>

      <GateForm next={next} />

      {/* Never auto-forwards a guest who already holds a grant: the field has
          to stay reachable so a second word can be entered. Only the most
          recent grant is offered — the cookie is newest-first, and listing
          every grant would both label the sections and tell a guest holding
          one that there is another to find. */}
      {granted[0] && (
        <Link
          href={SECTION_HOME[granted[0]]}
          className="mt-10 font-utility text-[11px] uppercase tracking-[0.24em] text-ink underline decoration-ink/30 underline-offset-[6px] hover:decoration-ink"
        >
          Continue
        </Link>
      )}
    </main>
  );
}
