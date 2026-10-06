import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meryl & John · Save the Date",
  description:
    "Save the date: Meryl & John are getting married on April 10, 2027 at St. Aloysius R.C. Church, Jersey City, NJ.",
};

export default function SaveTheDateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
