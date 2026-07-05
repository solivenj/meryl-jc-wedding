/*
 * Envelope paper geometry, back-to-front:
 * ground shadow → back panel → interior liner → side flaps → bottom flap →
 * flap cast-shadow → top flap (own <g data-flap> so P3 can hinge it) → monogram.
 * ViewBox space: envelope body 40,80 → 520,360 (see Envelope.tsx).
 */
export function EnvelopeGeometry({ p }: { p: string }) {
  return (
    <g>
      {/* Back panel + crisp silhouette edge */}
      <rect
        x="40"
        y="80"
        width="480"
        height="280"
        rx="6"
        fill="var(--color-paper)"
        filter={`url(#${p}-paper)`}
      />
      <rect
        x="40"
        y="80"
        width="480"
        height="280"
        rx="6"
        fill="none"
        stroke="#b7a98c"
        strokeOpacity="0.55"
        strokeWidth="1"
      />

      {/* Interior liner — visible only once the flap hinges open (P3). */}
      <rect x="46" y="84" width="468" height="150" fill="#c9bb9f" />

      {/* Side flaps folding toward center */}
      <path d="M 40 86 L 40 354 L 254 236 Z" fill={`url(#${p}-panel-side-l)`} filter={`url(#${p}-paper)`} />
      <path d="M 520 86 L 520 354 L 306 236 Z" fill={`url(#${p}-panel-side-r)`} filter={`url(#${p}-paper)`} />

      {/* Bottom flap over the side flaps */}
      <path
        d="M 40 356 L 520 356 C 470 322 330 234 292 214 C 284 210 276 210 268 214 C 230 234 90 322 40 356 Z"
        fill={`url(#${p}-panel-bottom)`}
        filter={`url(#${p}-paper)`}
      />
      {/* Bottom flap crease shadows */}
      <path
        d="M 40 356 C 90 322 230 234 268 214"
        fill="none"
        stroke="#8a7a5f"
        strokeOpacity="0.2"
        strokeWidth="1.4"
      />
      <path
        d="M 520 356 C 470 322 330 234 292 214"
        fill="none"
        stroke="#8a7a5f"
        strokeOpacity="0.2"
        strokeWidth="1.4"
      />

      {/* Top-light across the whole body */}
      <rect
        x="40"
        y="80"
        width="480"
        height="280"
        rx="6"
        fill={`url(#${p}-toplight)`}
        pointerEvents="none"
      />

      {/* Cast shadow of the flap edge onto the panels below — separate from the
          flap group so P3 can fade it as the flap lifts. */}
      <g clipPath={`url(#${p}-body-clip)`}>
        <path
          data-flap-shadow
          d="M 40 92 L 520 92 C 468 136 332 232 294 256 C 285 261.5 275 261.5 266 256 C 228 232 92 136 40 92 Z"
          fill="#6b5b41"
          opacity="0.18"
          filter={`url(#${p}-flap-blur)`}
        />
      </g>

      {/* Top flap — hinges at the fold line (y=84) in P3. Deckled edge, not a razor line. */}
      <g data-flap style={{ transformOrigin: "280px 84px" }}>
        <g filter={`url(#${p}-deckle)`}>
          <path
            d="M 40 84 L 520 84 C 468 128 332 226 294 250 C 285 255.5 275 255.5 266 250 C 228 226 92 128 40 84 Z"
            fill={`url(#${p}-flap)`}
            filter={`url(#${p}-paper)`}
          />
        </g>
        {/* Fold crease + soft shading along the flap sides */}
        <path d="M 40 84 L 520 84" stroke="#8a7a5f" strokeOpacity="0.25" strokeWidth="2" />
        <path
          d="M 40 84 C 92 128 228 226 266 250"
          fill="none"
          stroke="#8a7a5f"
          strokeOpacity="0.16"
          strokeWidth="1.2"
        />
        <path
          d="M 520 84 C 468 128 332 226 294 250"
          fill="none"
          stroke="#8a7a5f"
          strokeOpacity="0.16"
          strokeWidth="1.2"
        />

        {/* Wax-seal-style monogram medallion on the flap point */}
        <g data-medallion>
          <ellipse
            cx="280"
            cy="230"
            rx="32"
            ry="39"
            fill="#f4edde"
            stroke="var(--color-ribbon-deep)"
            strokeWidth="1.8"
          />
          <ellipse
            cx="280"
            cy="230"
            rx="26"
            ry="33"
            fill="none"
            stroke="var(--color-ribbon-deep)"
            strokeWidth="0.8"
            strokeOpacity="0.75"
          />
          <text
            x="268"
            y="242"
            textAnchor="middle"
            fontSize="46"
            fill="var(--color-ribbon-deep)"
            stroke="var(--color-ribbon-deep)"
            strokeWidth="0.5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            M
          </text>
          <text
            x="296"
            y="250"
            textAnchor="middle"
            fontSize="46"
            fill="var(--color-ribbon-deep)"
            stroke="var(--color-ribbon-deep)"
            strokeWidth="0.5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            J
          </text>
        </g>
      </g>
    </g>
  );
}
