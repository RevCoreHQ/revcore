import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team behind RevCore. We build automated revenue systems exclusively for home service contractors — lead generation, sales training, and proprietary software.",
  openGraph: {
    title: "About RevCore",
    description:
      "Meet the team behind RevCore. Automated revenue systems for home service contractors.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
