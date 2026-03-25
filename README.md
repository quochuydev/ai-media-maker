# AI Media Maker

**AI-powered image generation platform with bulk generation, cloud storage, and developer API.** Generate stunning images from text prompts.

## What's Included

| Feature | Status | Details |
|---------|--------|---------|
| Image Generation | Ready | AI-powered text-to-image via HuggingFace Gradio |
| Bulk Generation | Ready | Up to 10 images per batch with background processing |
| Cloud Storage | Ready | Cloudflare R2 for secure image storage |
| Authentication | Ready | Google OAuth via Clerk, user sync to DB |
| Payments | Ready | PayPal checkout, credit system, transaction history |
| API Key Management | Ready | Generate, revoke, audit log, usage tracking |
| Documentation | Ready | MDX-based docs with Fumadocs |
| Blog | Ready | Category filtering, individual post pages |
| Pricing Page | Ready | Credit packages with per-unit pricing |
| User Dashboard | Ready | API keys, usage stats, billing & credits |
| Landing Page | Ready | Hero, features, stats, CTA sections |
| Legal Pages | Ready | Privacy policy, terms of service |
| SEO | Ready | OpenGraph, structured data, sitemap, robots.txt, llms.txt |

## Tech Stack

- Next.js 16 / React 19
- TypeScript
- Tailwind CSS v4
- Clerk (authentication)
- Drizzle ORM + PostgreSQL (Neon)
- PayPal (payments)
- HuggingFace Gradio (AI image generation)
- Cloudflare R2 (image storage)

## Project Structure

```
cooker/
├── src/app/                  # Next.js App Router
│   ├── (public pages)        # /, /blog, /pricing, /docs, /playground
│   ├── c/cloud/              # Protected dashboard (api-keys, usage, billing)
│   ├── api/                  # API routes (keys, billing, images, usage)
│   └── login/                # Clerk sign-in
├── src/components/           # Shared UI components
├── src/db/                   # Drizzle schema & database
├── src/lib/                  # Auth, PayPal, R2, image service, config
├── content/docs/             # MDX documentation pages
└── public/                   # Static assets

ingredients/
├── image.js                  # HuggingFace Gradio image generation
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/docs` | Documentation (Fumadocs) |
| `/blog` | Blog with category filter |
| `/pricing` | Pricing page |
| `/playground` | Bulk image generation interface |
| `/login` | Google OAuth sign-in |
| `/c/cloud/api-keys` | API key management |
| `/c/cloud/usage` | Usage dashboard |
| `/c/cloud/billing` | Billing & credit purchases |
| `/cloud` | Cloud landing page |
| `/about-us` | About page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## Quick Start

```bash
git clone https://github.com/quochuydev/ai-media-maker.git
cd ai-media-maker/cooker
npm install
cp .env.example .env
# Configure environment variables (see .env.example)
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pricing (Default)

| Package | Credits | Price |
|---------|---------|-------|
| Starter | 1 | $1 |
| Growth | 6 | $5 |
| Scale | 30 | $20 |

1 credit = 1 image generation.

## Contact

- Email: quochuy.dev@gmail.com
- GitHub: [github.com/quochuydev/ai-media-maker](https://github.com/quochuydev/ai-media-maker)

## License

MIT
