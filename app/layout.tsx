import type { Metadata } from "next";
import { Pinyon_Script, EB_Garamond, Jost } from "next/font/google";
import "./globals.css";

/*
 * Typography roles (PRD §6):
 *  display — Pinyon Script: copperplate roundhand, featured ampersand, large sizes only
 *  body    — EB Garamond: invitation copy, reception blocks
 *  utility — Jost: geometric sans for eyebrows/CTA/timeline, uppercase + tracked
 */
const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meryl & John · Save the Date",
  description:
    "Save the date: Meryl & John are getting married on April 10, 2027 at St. Aloysius R.C. Church, Jersey City, NJ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pinyon.variable} ${garamond.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
