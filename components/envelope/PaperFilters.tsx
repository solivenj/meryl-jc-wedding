/*
 * Shared SVG <defs> for the envelope: paper grain, deckled edge, gradients.
 * `p` prefixes every id so the envelope can mount twice (Act I + S2 miniature)
 * without id collisions.
 */
export function PaperFilters({ p }: { p: string }) {
  return (
    <defs>
      {/* Paper texture as a grain-ONLY output, applied to two overlay rects
          (body + flap face) instead of per-shape — one turbulence pair per
          overlay keeps raster cost flat (perf: main-thread budget). */}
      <filter id={`${p}-grain`} x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008"
          numOctaves="2"
          seed="7"
          result="coarse"
        />
        <feColorMatrix
          in="coarse"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.07 0.07 0.07 0 -0.05"
          result="coarseDark"
        />
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.45"
          numOctaves="2"
          seed="3"
          result="fiber"
        />
        <feColorMatrix
          in="fiber"
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.95  0.1 0.1 0.1 0 -0.09"
          result="fiberLight"
        />
        <feComposite in="coarseDark" in2="SourceAlpha" operator="in" result="grainIn" />
        <feComposite in="fiberLight" in2="SourceAlpha" operator="in" result="fiberIn" />
        <feMerge>
          <feMergeNode in="grainIn" />
          <feMergeNode in="fiberIn" />
        </feMerge>
      </filter>

      {/* Clip matching the sealed flap outline, for its grain overlay. */}
      <clipPath id={`${p}-flap-clip`}>
        <path d="M 40 84 L 520 84 C 468 128 332 226 294 250 C 285 255.5 275 255.5 266 250 C 228 226 92 128 40 84 Z" />
      </clipPath>

      {/* Deckled edge: barely-visible displacement so the flap edge is not a razor line. */}
      <filter id={`${p}-deckle`} x="-4%" y="-4%" width="108%" height="108%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
      </filter>

      {/* Soft blur for shadows cast onto the paper (ribbon, flap edge). */}
      <filter id={`${p}-soft-blur`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" />
      </filter>
      <filter id={`${p}-flap-blur`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" />
      </filter>

      {/* Large warm ground shadow under the envelope. */}
      <filter id={`${p}-ground-blur`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="16" />
      </filter>

      {/* Envelope body: faint top-light. */}
      <linearGradient id={`${p}-toplight`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.32" />
        <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.07" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* Flap: lit from above (lighter than the body panels so the fold reads). */}
      <linearGradient id={`${p}-flap`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f3ecdd" />
        <stop offset="0.6" stopColor="#efe6d4" />
        <stop offset="1" stopColor="var(--color-paper)" />
      </linearGradient>

      {/* Side/bottom panels: deeper than the flap. */}
      <linearGradient id={`${p}-panel-side-l`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="var(--color-paper-shade)" />
        <stop offset="1" stopColor="var(--color-paper)" />
      </linearGradient>
      <linearGradient id={`${p}-panel-side-r`} x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor="var(--color-paper-shade)" />
        <stop offset="1" stopColor="var(--color-paper)" />
      </linearGradient>
      <linearGradient id={`${p}-panel-bottom`} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="var(--color-paper)" />
        <stop offset="1" stopColor="var(--color-paper-shade)" />
      </linearGradient>

      {/* Satin ribbon: light band along the length, deep edges. */}
      <linearGradient id={`${p}-satin-v`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="var(--color-ribbon-deep)" />
        <stop offset="0.28" stopColor="var(--color-ribbon)" />
        <stop offset="0.5" stopColor="var(--color-ribbon-light)" />
        <stop offset="0.72" stopColor="var(--color-ribbon)" />
        <stop offset="1" stopColor="var(--color-ribbon-deep)" />
      </linearGradient>
      <linearGradient id={`${p}-satin-h`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--color-ribbon-deep)" />
        <stop offset="0.28" stopColor="var(--color-ribbon)" />
        <stop offset="0.5" stopColor="var(--color-ribbon-light)" />
        <stop offset="0.72" stopColor="var(--color-ribbon)" />
        <stop offset="1" stopColor="var(--color-ribbon-deep)" />
      </linearGradient>

      {/* Bow loops: diagonal sheen. */}
      <linearGradient id={`${p}-loop`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--color-ribbon-light)" />
        <stop offset="0.55" stopColor="var(--color-ribbon)" />
        <stop offset="1" stopColor="var(--color-ribbon-deep)" />
      </linearGradient>
      <linearGradient id={`${p}-knot`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--color-ribbon)" />
        <stop offset="1" stopColor="var(--color-ribbon-deep)" />
      </linearGradient>

      {/* Clip: full envelope silhouette (keeps cast shadows on the paper). */}
      <clipPath id={`${p}-body-clip`}>
        <rect x="40" y="80" width="480" height="280" rx="6" />
      </clipPath>

      {/* Clip: everything above the fold line — the card emerges through this slot. */}
      <clipPath id={`${p}-slot-clip`}>
        <rect x="20" y="-240" width="520" height="324" />
      </clipPath>

      {/* Card face: barely-warm ivory with a whisper of top light. */}
      <linearGradient id={`${p}-card`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#faf6ee" />
        <stop offset="1" stopColor="#f4eee1" />
      </linearGradient>
    </defs>
  );
}
