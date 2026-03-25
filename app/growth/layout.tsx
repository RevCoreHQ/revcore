import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Growth",
  description:
    "Explore RevCore's growth strategies for home service contractors. Proven systems to increase leads, appointments, and revenue in your exclusive territory.",
  openGraph: {
    title: "Growth — RevCore",
    description:
      "Proven growth strategies for home service contractors. Increase leads, appointments, and revenue.",
  },
};

export default function GrowthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
