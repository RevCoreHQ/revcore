import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with RevCore. Book a strategy call to learn how we can help grow your home service business with automated lead generation and sales systems.",
  openGraph: {
    title: "Contact RevCore",
    description:
      "Book a strategy call with RevCore. Automated revenue systems for home service contractors.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
