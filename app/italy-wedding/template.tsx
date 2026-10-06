/* Remounts on every tab change, so each page rises in (CSS; off under
   prefers-reduced-motion — see .italy-rise in globals.css). */
export default function ItalyTemplate({ children }: { children: React.ReactNode }) {
  return <div className="italy-rise">{children}</div>;
}
