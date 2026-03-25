import type { Metadata } from "next";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Generate AI-powered images in bulk. Enter prompts and get high-quality images generated instantly.",
  keywords: [
    "image generation",
    "AI images",
    "playground",
    "bulk generation",
    "text to image",
  ],
  openGraph: {
    title: `Playground | ${config.site.name}`,
    description:
      "Generate AI-powered images in bulk. Enter prompts and get high-quality images instantly.",
    url: `${config.site.url}/playground`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Playground | ${config.site.name}`,
    description:
      "Generate AI-powered images in bulk. Enter prompts and get high-quality images instantly.",
  },
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
