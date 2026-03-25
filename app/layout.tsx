import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ConditionalFooter from "@/components/ConditionalFooter";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import PageLoader from "@/components/PageLoader";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0A0A",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://revcorehq.com"),
  title: {
    default: "RevCore — Revenue Systems for Home Service Contractors",
    template: "%s | RevCore",
  },
  description:
    "Automated lead generation, sales training, and proprietary software built exclusively for home service contractors. Exclusive territory. Performance guaranteed.",
  keywords: [
    "home service contractors",
    "lead generation",
    "sales training",
    "contractor software",
    "HVAC leads",
    "roofing leads",
    "plumbing leads",
    "home service marketing",
    "RevCore",
  ],
  authors: [{ name: "RevCore HQ" }],
  creator: "RevCore HQ",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://revcorehq.com",
    siteName: "RevCore",
    title: "RevCore — Revenue Systems for Home Service Contractors",
    description:
      "Automated lead generation, sales training, and proprietary software built exclusively for home service contractors. Exclusive territory. Performance guaranteed.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RevCore — Revenue Systems for Home Service Contractors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RevCore — Revenue Systems for Home Service Contractors",
    description:
      "Automated lead generation, sales training, and proprietary software built exclusively for home service contractors.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RevCore HQ",
  url: "https://revcorehq.com",
  logo: "https://assets.cdn.filesafe.space/NYlSya2nYSkSnnXEbY2l/media/69a9af9fb003fa7bb8bb92ee.png",
  description:
    "Automated revenue systems for home service contractors. Lead generation, sales training, and proprietary software.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@revcorehq.com",
    contactType: "sales",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SmoothScroll>
          <PageLoader />
          <CustomCursor />
          <Header />
          <main>{children}</main>
          <ConditionalFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
