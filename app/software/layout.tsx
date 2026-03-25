import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software",
  description:
    "RevCore's proprietary software suite for home service contractors — CRM, automation, scheduling, and analytics built to maximize revenue.",
  openGraph: {
    title: "Software — RevCore",
    description:
      "Proprietary software suite for home service contractors. CRM, automation, scheduling, and analytics.",
  },
};

export default function SoftwareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
