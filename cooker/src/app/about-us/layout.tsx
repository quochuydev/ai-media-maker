import type { Metadata } from "next";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${config.site.name} and our mission to make AI image generation accessible to everyone.`,
  keywords: ["about", "team", "company", `${config.site.name} team`],
  openGraph: {
    title: `About Us | ${config.site.name}`,
    description: `Learn about ${config.site.name} and our mission to provide AI image generation accessible.`,
    url: `${config.site.url}/about-us`,
  },
  twitter: {
    card: "summary_large_image",
    title: `About Us | ${config.site.name}`,
    description: `Learn about ${config.site.name} and our mission to provide AI image generation accessible.`,
  },
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
