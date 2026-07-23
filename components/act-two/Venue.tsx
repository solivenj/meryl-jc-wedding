"use client";

import { Reveal } from "@/components/ui/Reveal";
import { VENUES } from "@/lib/content";
import { VenueMap } from "./VenueMap";
import { useCappedWidth } from "@/components/dev/WidthToggleContext";

/*
 * Where. The two venues side by side — ceremony (church) left, reception
 * right — on the ivory-deep tint, so the run of sections alternates:
 * Countdown (ivory) → Venues (tint) → RSVP (ivory) → Program (tint).
 */
export function Venue() {
  // TEMP — capped is the dev A/B toggle; once John's picked a width, drop
  // this and always render the max-w-5xl wrapper below (see the plan).
  const [capped] = useCappedWidth();
  return (
    <section className="bg-ivory-deep py-24 sm:py-32">
      {/* Capped at max-w-5xl so the halves shrink together on wide screens —
          otherwise short content sits centered in a much-too-wide half,
          leaving a large empty gap at the shared midline. Same two-halves
          split as Program within that: no column gap so the divide sits at
          50%; gap-y-20 gives breathing room when stacked below md. */}
      <div className={capped ? "mx-auto max-w-5xl" : undefined}>
        <div className="grid items-start gap-y-20 md:grid-cols-2">
          {VENUES.map((venue, i) => (
            <div key={venue.name} className="flex justify-center px-6">
              <div className="w-full max-w-md">
                <Reveal delay={i * 0.1}>
                  <VenueMap
                    label={venue.label}
                    name={venue.name}
                    address={venue.address}
                    time={venue.time}
                  />
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
