import { config } from "@/lib/config";

export async function GET() {
  const { name, email } = config.site;
  const url = config.app.url;

  const content = `# ${name}

> AI-powered media generation platform. Generate stunning images from text prompts with bulk generation and cloud storage.

## Overview

${name} is an AI-powered image generation platform that lets you create high-quality images from text prompts. Supports bulk generation of up to 10 images per batch with secure cloud storage.

## Website

${url}

## Features

- **AI Image Generation**: Generate high-quality images from text prompts using advanced AI models
- **Bulk Generation**: Create up to 10 images at once with different prompts
- **Cloud Storage**: Images stored securely on Cloudflare R2 with instant access
- **Credit-based Billing**: Pay only for what you use

## Pages

### Home (/)
Landing page showcasing ${name} capabilities.

### Documentation (/docs)
Comprehensive documentation for integrating ${name} into your applications.

- Getting Started Guide
- Sample Projects
- FAQ
- Cloud API documentation (API Keys, Pricing)

### Blog (/blog)
Latest news, tutorials, and updates about ${name}.

Categories:
- Showcase: Demo projects and implementations
- Release: Version announcements and changelogs
- Announcement: Company and product news

### Pricing (/pricing)
Credit-based pricing:

- Starter: $1 for 1 credit
- Growth: $5 for 6 credits
- Scale: $20 for 30 credits

### Playground (/playground)
Interactive demo where users can generate AI images. Enter prompts and generate up to 10 images at once. Requires sign-in and uses credits (1 credit per image).

### Cloud (/cloud)
Landing page for ${name} Cloud services.

### Station (/station)
Central hub for managing ${name} configurations.

### About Us (/about-us)
Information about ${name}.

Contact:
- Email: ${email}
- GitHub: ${config.site.github.replace("https://", "")}

### Terms of Service (/terms)
Legal terms and conditions for using ${name} services.

### Privacy Policy (/privacy)
Privacy policy explaining data collection and user rights.

## Cloud Dashboard (/c/cloud/*)

Authenticated area for managing cloud services:
- **API Keys** (/c/cloud/api-keys): Create and manage API keys
- **Usage** (/c/cloud/usage): View API usage statistics
- **Billing** (/c/cloud/billing): Manage billing and credits

## Technical Stack

- **Framework**: Next.js (App Router)
- **AI**: HuggingFace Gradio (image generation)
- **Authentication**: Clerk
- **Payments**: PayPal
- **Storage**: Cloudflare R2
- **Documentation**: Fumadocs
- **Styling**: Tailwind CSS

## Keywords

AI, image generation, text to image, media maker, bulk generation, cloud storage

## Contact

For inquiries: ${email}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
