/*
 * One venue: eyebrow label, name, address + time, and an embedded map.
 *
 * Plain Google Maps iframe (?output=embed) — no API key, no billing, no env
 * var. Lazy-loaded and below the fold, so the third-party frame costs nothing
 * on first paint.
 */
export function VenueMap({
  label,
  name,
  address,
  time,
}: {
  label: string;
  name: string;
  address: string;
  time: string;
}) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div>
      <p className="font-utility text-[11px] uppercase tracking-[0.26em] text-ink-soft">
        {label}
      </p>
      {/* Sized so the longer church name still fits on one line — keeps both
          columns' name-to-map spacing identical without reserving extra height. */}
      <h3 className="mt-2 whitespace-nowrap font-display text-[clamp(1.5rem,5vw,2.75rem)] leading-[1.15] text-ink">
        {name}
      </h3>
      <p className="mt-2 font-body text-[15.5px] leading-[1.75] text-ink-soft">
        {address}
        <span className="mx-2 text-ink/30">·</span>
        {time}
      </p>

      <div className="mt-4 aspect-[4/3] overflow-hidden rounded-lg border border-ink/15">
        <iframe
          /* An untitled iframe is a WCAG failure — name it for screen readers. */
          title={`Map of ${name}, ${address}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
