import type { Metadata } from "next";
import { StoryFallback } from "@/components/italy/road/StoryFallback";

export const metadata: Metadata = { title: "Our Story" };

/*
 * Our Story — a drive up a switchback road to Todi.
 * Design: docs/superpowers/specs/2026-11-11-our-story-road-trip-design.md
 */
export default function OurStoryPage() {
  return (
    <>
      <h1 className="sr-only">Our story</h1>
      <StoryFallback />
    </>
  );
}
