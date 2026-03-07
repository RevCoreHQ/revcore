import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ConditionalFooter from "@/components/ConditionalFooter";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "RevCore — Revenue Systems for Home Service Contractors",
  description: "Automated lead generation, sales training, and proprietary software built exclusively for home service contractors. Exclusive territory. Performance guaranteed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <CustomCursor />
          <Header />
          <main>{children}</main>
          <ConditionalFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
