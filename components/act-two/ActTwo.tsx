"use client";

import { motion } from "motion/react";
import { Hero } from "./Hero";
import { Story } from "./Story";
import { PhotoBand } from "./PhotoBand";
import { Countdown } from "./Countdown";
import { Venue } from "./Venue";
import { Rsvp } from "./Rsvp";
import { Program } from "./Program";
import { TravelFaq } from "./TravelFaq";
import { Closing } from "./Closing";
import { WidthToggleProvider } from "@/components/dev/WidthToggleContext";
import { WidthToggle } from "@/components/dev/WidthToggle";

/*
 * Act II — the site (PRD §4). Nine sections, standard scrolling, no
 * scroll-jacking. Root stays ivory and fades content up inside it so the
 * Act I hand-off is ivory-to-ivory (no flash, no muddy blend).
 *
 * From the countdown down, panels alternate ivory / ivory-deep so each
 * section reads as its own beat: Countdown, Venues, RSVP, Program,
 * Travel & FAQ, then the full-bleed Closing photo.
 */
export function ActTwo({ reduced }: { reduced: boolean }) {
  return (
    // TEMP — WidthToggleProvider/WidthToggle are a dev-only A/B toggle for
    // the Program/Venue/TravelFaq width fix; remove both once John's picked
    // a final width (see the plan's cleanup steps).
    <WidthToggleProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.4 : 0.9, ease: "easeOut" }}
        className="bg-ivory"
      >
        <Hero />
        <Story />
        <PhotoBand />
        <Countdown />
        <Venue />
        <Rsvp />
        <Program />
        <TravelFaq />
        <Closing />
      </motion.div>
      <WidthToggle />
    </WidthToggleProvider>
  );
}
