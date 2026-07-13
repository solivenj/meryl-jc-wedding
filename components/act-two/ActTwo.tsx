"use client";

import { motion } from "motion/react";
import { Hero } from "./Hero";
import { Story } from "./Story";
import { PhotoBand } from "./PhotoBand";
import { Rsvp } from "./Rsvp";
import { Program } from "./Program";
import { TravelFaq } from "./TravelFaq";
import { Closing } from "./Closing";

/*
 * Act II — the site (PRD §4). Seven sections, standard scrolling, no
 * scroll-jacking. Root stays ivory and fades content up inside it so the
 * Act I hand-off is ivory-to-ivory (no flash, no muddy blend).
 */
export function ActTwo({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.4 : 0.9, ease: "easeOut" }}
      className="bg-ivory"
    >
      <Hero />
      <Story />
      <PhotoBand />
      <Rsvp />
      <Program />
      <TravelFaq />
      <Closing />
    </motion.div>
  );
}
