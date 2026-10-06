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
      <p className="font-caps text-[10px] uppercase tracking-[0.24em] text-ink-soft">{children}</p>
      <Rule />
    </div>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block h-px w-[52px] bg-rule ${className}`} />;
}

export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-caps text-[12px] uppercase tracking-[0.2em] text-ink ${className}`}>{children}</p>
  );
}

export function SmallCaps({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-caps text-[10px] uppercase tracking-[0.24em] text-forest ${className}`}>{children}</p>
  );
}

export function ScriptTitle({
  as: Tag = "h2",
  children,
}: {
  as?: "h1" | "h2" | "h3";
  children: React.ReactNode;
}) {
  return (
    <Tag className="font-display text-[clamp(26px,3.4vw,38px)] leading-[1.25] font-normal text-ink">
      {children}
    </Tag>
  );
}

export function Prose({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`max-w-[62ch] text-left font-body text-[17px] leading-[1.65] font-light text-ink-soft ${className}`}
    >
      {children}
    </p>
  );
}

/* Tracked, underlined caps link (email, registry). */
export const capsLinkClass =
  "font-caps text-[11.5px] uppercase tracking-[0.155em] text-forest underline underline-offset-[6px] decoration-forest/40 hover:decoration-forest";
