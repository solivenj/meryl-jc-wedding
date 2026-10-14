import type { Metadata } from "next";
import { GateForm } from "@/components/gate/GateForm";
import { COUPLE } from "@/lib/content";

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
 *
 * It never reads the gate cookie, so a guest who is already through still
 * sees the field rather than a Continue shortcut. That is deliberate while
 * replies are open — the field has to stay reachable so a second word can be
 * entered, and a shortcut on a shared screen walks the next person straight
 * in. Bring the shortcut back once RSVPs close; lib/site-gate exports
 * grantedSections and SECTION_HOME for exactly that.
 */
export default async function GatePage({
  searchParams,
}: {
  // A Promise in this version of Next — await before reading.
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

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
        Please enter the password found on your invitation
      </p>

      <GateForm next={next} />
    </main>
  );
}
