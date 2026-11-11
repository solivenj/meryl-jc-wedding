import { Overpass, Titillium_Web } from "next/font/google";

/* The two road-sign faces (design doc §7): Overpass is close to US highway
   lettering (signs, odometer, stamps); Titillium for the Italian and EU signs.
   Scoped to the road trip through CSS variables on its root. */
export const overpass = Overpass({
  variable: "--font-overpass",
  weight: ["700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const titillium = Titillium_Web({
  variable: "--font-titillium",
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
});
