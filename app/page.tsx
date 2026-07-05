"use client";

/* P1 review page: static envelope centered on the ivory field.
   Replaced by the sealed/opened state machine in P2/P3. */

import { Envelope } from "@/components/envelope/Envelope";

export default function Page() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-ivory px-6">
      <div className="w-[85vw] max-w-[560px]">
        <Envelope />
      </div>
    </main>
  );
}
