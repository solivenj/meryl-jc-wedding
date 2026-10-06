"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ITALY_NAV } from "@/lib/italy-content";

/* Header nav: tracked Baskerville caps with an underline that draws in on
   hover and stays under the current tab. */
export function ItalyNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Wedding"
      className="flex max-w-[760px] flex-wrap justify-center gap-x-[30px] gap-y-[18px]"
    >
      {ITALY_NAV.map((item) => {
        const current = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className="group relative whitespace-nowrap pb-1.5 font-caps text-[11.5px] uppercase tracking-[0.155em] text-forest"
          >
            {item.label}
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 h-px bg-forest transition-transform duration-[350ms] ease-out motion-reduce:transition-none ${
                current
                  ? "scale-x-100"
                  : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
