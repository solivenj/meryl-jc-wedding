"use client";

import { useId } from "react";
import { PaperFilters } from "./PaperFilters";
import { EnvelopeGeometry } from "./EnvelopeGeometry";
import { Ribbon } from "./Ribbon";
import { ACT_ONE } from "@/lib/content";

type EnvelopeProps = {
  /** "full" = Act I interactive button; "miniature" = S2 decorative callback. */
  variant?: "full" | "miniature";
  onOpen?: () => void;
  className?: string;
};

/**
 * The envelope scene. In "full" mode it is a real <button> (keyboard path,
 * generous hit area = the whole envelope group, PRD §3.3).
 */
export function Envelope({ variant = "full", onOpen, className }: EnvelopeProps) {
  const raw = useId();
  const p = `env${raw.replace(/[^a-zA-Z0-9]/g, "")}`;

  const svg = (
    <svg
      viewBox="0 0 560 400"
      role={variant === "miniature" ? "img" : undefined}
      aria-hidden={variant === "full" ? true : undefined}
      aria-label={
        variant === "miniature"
          ? "A small paper envelope tied again with its dusty blue ribbon"
          : undefined
      }
      className="block h-auto w-full"
    >
      <PaperFilters p={p} />
      <EnvelopeGeometry p={p} />
      <Ribbon p={p} />
    </svg>
  );

  if (variant === "miniature") {
    return <div className={className}>{svg}</div>;
  }

  return (
    <button
      type="button"
      aria-label={ACT_ONE.openLabel}
      onClick={onOpen}
      className={`block w-full cursor-pointer select-none ${className ?? ""}`}
    >
      {svg}
    </button>
  );
}
