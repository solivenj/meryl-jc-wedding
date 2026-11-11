/*
 * The Italy type scale, in one place so no tab drifts:
 *   Eyebrow  Baskerville caps 10px / .24em, ink-soft, over a 52px hairline
 *   Label    Baskerville caps 12px / .2em
 *   Script   Pinyon Script clamp(26–38px) — section titles
 *   Prose    Cormorant 300, 17px / 1.65, 62ch
 */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="font-caps text-[calc(10px*var(--fs-scale))] uppercase tracking-[0.24em] text-ink-soft">{children}</p>
      <Rule />
    </div>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block h-px w-[52px] bg-rule ${className}`} />;
}

export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-caps text-[calc(12px*var(--fs-scale))] uppercase tracking-[0.2em] text-ink ${className}`}>{children}</p>
  );
}

export function SmallCaps({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-caps text-[calc(10px*var(--fs-scale))] uppercase tracking-[0.24em] text-forest ${className}`}>{children}</p>
  );
}

/* Two sizes, not a className override: both would be arbitrary text-[…]
   utilities, so which one won would come down to the order Tailwind emitted
   them in rather than the order they are written. */
const SCRIPT_SIZE = {
  default: "text-[calc(clamp(26px,3.4vw,38px)*var(--fs-scale))]",
  /* The one line a guest reads first on a page. Scales on the same curve. */
  lead: "text-[calc(clamp(34px,4.6vw,52px)*var(--fs-scale))]",
  /* For titles sharing a narrow column, where the longest of the set has to
     stay on one line. Measured against "Ceremony & Reception" in a 236px
     column at 820px, which is the tightest the three-up grid ever gets. */
  compact: "text-[calc(clamp(24px,2.9vw,34px)*var(--fs-scale))]",
} as const;

export function ScriptTitle({
  as: Tag = "h2",
  size = "default",
  children,
}: {
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof SCRIPT_SIZE;
  children: React.ReactNode;
}) {
  return (
    <Tag className={`font-display ${SCRIPT_SIZE[size]} leading-[1.25] font-normal text-ink`}>
      {children}
    </Tag>
  );
}

/* Same reasoning as SCRIPT_SIZE: picking the whole utility beats passing
   `text-center` in className, where the winner would be decided by the order
   Tailwind emitted the two alignment rules in. */
const PROSE_ALIGN = { left: "text-left", center: "text-center" } as const;

export function Prose({
  children,
  align = "left",
  className = "",
}: {
  children: React.ReactNode;
  align?: keyof typeof PROSE_ALIGN;
  className?: string;
}) {
  return (
    <p
      className={`max-w-[62ch] ${PROSE_ALIGN[align]} font-body text-[calc(17px*var(--fs-scale))] leading-[1.65] font-light text-ink-soft ${className}`}
    >
      {children}
    </p>
  );
}

/* Tracked, underlined caps link (email, registry). */
export const capsLinkClass =
  "font-caps text-[calc(11.5px*var(--fs-scale))] uppercase tracking-[0.155em] text-forest underline underline-offset-[6px] decoration-forest/40 hover:decoration-forest";
