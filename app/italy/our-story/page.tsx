import type { Metadata } from "next";
import { RoadTrip } from "@/components/italy/road/RoadTrip";
import { StoryFallback } from "@/components/italy/road/StoryFallback";

export const metadata: Metadata = { title: "Our Story" };

/*
 * Our Story — a drive up a switchback road to Todi.
 * Design: docs/superpowers/specs/2026-11-11-our-story-road-trip-design.md
 *
 * Two renderings of one story. The drive is decorative to assistive tech;
 * StoryFallback is the single copy screen readers read. It is visually hidden
 * while the drive shows, and becomes the page for readers with reduced motion
 * or no JavaScript (road.css + the noscript rules below).
 */
export default function OurStoryPage() {
  return (
    <>
      <h1 className="sr-only">Our story</h1>
      <noscript>
        <style>{".road-trip{display:none!important}.road-fallback{position:static!important;width:auto!important;height:auto!important;margin:0!important;overflow:visible!important;clip:auto!important;clip-path:none!important;white-space:normal!important}"}</style>
      </noscript>
      <RoadTrip />
      <div className="road-fallback">
        <StoryFallback />
      </div>
    </>
  );
}
