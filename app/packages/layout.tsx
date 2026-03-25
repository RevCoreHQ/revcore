import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "View RevCore's service packages for home service contractors. Choose the plan that fits your business — from lead generation to full revenue system management.",
  openGraph: {
    title: "Packages — RevCore",
    description:
      "Service packages for home service contractors. Lead generation to full revenue system management.",
  },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
