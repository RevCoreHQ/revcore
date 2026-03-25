import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal", "/tracker", "/onboarding", "/sales", "/q/", "/booked", "/confirmed"],
    },
    sitemap: "https://revcorehq.com/sitemap.xml",
  };
}
