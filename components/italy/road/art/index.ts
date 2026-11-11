/* All of the road trip's drawings, in the prototype's paint order. */
import { backdropArt } from "./backdrop.ts";
import { prologueArt } from "./prologue.ts";
import { bostonArt } from "./boston.ts";
import { distanceArt, longArcD } from "./distance.ts";
import { italy22Art } from "./italy22.ts";
import { chicagoArt } from "./chicago.ts";
import { halfStopsArt } from "./halfStops.ts";
import { thanksgivingArt } from "./thanksgiving.ts";
import { crossingArt } from "./crossing.ts";
import { umbriaArt } from "./umbria.ts";
import { todiArt } from "./todi.ts";

export { defsMarkup } from "./defs.ts";
export { longArcD };

const SCENES = [backdropArt, prologueArt, bostonArt, distanceArt, italy22Art, chicagoArt, halfStopsArt, thanksgivingArt, crossingArt, umbriaArt, todiArt];

let cache: { backdrop: string; scenery: string; fx: string } | null = null;
const all = () => {
  if (!cache) {
    const parts = SCENES.map((f) => f());
    cache = {
      backdrop: parts.map((p) => p.backdrop).join(""),
      scenery: parts.map((p) => p.scenery).join(""),
      fx: parts.map((p) => p.fx).join(""),
    };
  }
  return cache;
};

export const backdropMarkup = (): string => all().backdrop;
export const sceneryMarkup = (): string => all().scenery;
export const fxMarkup = (): string => all().fx;
