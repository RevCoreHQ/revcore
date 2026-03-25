import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Lead generation, organic growth, smart automation, sales training, and proprietary software — all built exclusively for home service contractors.",
  openGraph: {
    title: "Services — RevCore",
    description:
      "Full-stack revenue services for home service contractors: leads, automation, training, and software.",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
