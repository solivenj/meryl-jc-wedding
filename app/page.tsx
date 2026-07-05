"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ActOne } from "@/components/act-one/ActOne";
import { ActTwo } from "@/components/act-two/ActTwo";
import { REDUCED, UNRAVEL } from "@/lib/motion";

/*
 * Two-act state machine (PRD §7): sealed → opening → opened.
 * Once opened, Act I never replays in-session; nothing is persisted, so a
 * returning visitor gets the full open again (PRD §3.3).
 */
type Stage = "sealed" | "opening" | "opened";

/** Hand-off begins just before the card finishes rising — no hard cut. */
const HANDOFF_MS =
  (UNRAVEL.bandOverlap + UNRAVEL.bandSlide + UNRAVEL.flapOpen * 0.65 + UNRAVEL.reveal * 0.7) *
  1000;

export default function Page() {
  const [stage, setStage] = useState<Stage>("sealed");
  const reduced = useReducedMotion();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const handleOpen = () => {
    if (stage !== "sealed") return;
    if (reduced) {
      setStage("opened");
      return;
    }
    setStage("opening");
    timer.current = window.setTimeout(() => setStage("opened"), HANDOFF_MS);
  };

  return (
    <main className="bg-ivory">
      <AnimatePresence>
        {stage !== "opened" && (
          <motion.div
            key="act-one"
            exit={
              reduced
                ? { opacity: 0, transition: { duration: REDUCED.crossFade } }
                : { opacity: 0, scale: 1.06, transition: { duration: 0.7, ease: "easeIn" } }
            }
            className="fixed inset-0 z-20 origin-center overflow-y-auto bg-ivory"
          >
            <ActOne stage={stage === "opening" ? "opening" : "sealed"} onOpen={handleOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      {stage === "opened" && <ActTwo reduced={reduced ?? false} />}
    </main>
  );
}
