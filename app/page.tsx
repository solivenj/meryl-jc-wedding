"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ActOne } from "@/components/act-one/ActOne";
import { ActTwo } from "@/components/act-two/ActTwo";
import { REDUCED } from "@/lib/motion";

/*
 * Two-act state machine (PRD §7): sealed → opened. Clicking the envelope
 * fades the whole Act I scene into Act II — the envelope is a static
 * keepsake image now, so there is no unravel stage. Once opened, Act I
 * never replays in-session; nothing is persisted (PRD §3.3).
 */
type Stage = "sealed" | "opened";

export default function Page() {
  const [stage, setStage] = useState<Stage>("sealed");
  const reduced = useReducedMotion();

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
            <ActOne onOpen={() => setStage("opened")} />
          </motion.div>
        )}
      </AnimatePresence>

      {stage === "opened" && <ActTwo reduced={reduced ?? false} />}
    </main>
  );
}
