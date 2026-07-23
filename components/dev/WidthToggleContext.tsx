"use client";

import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";

/* TEMP — remove this file and its usages once John's picked a width. */
const Ctx = createContext<[boolean, Dispatch<SetStateAction<boolean>>] | null>(null);

export function WidthToggleProvider({ children }: { children: React.ReactNode }) {
  const state = useState(true); // starts on the new capped layout
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export function useCappedWidth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCappedWidth must be used within WidthToggleProvider");
  return ctx;
}
