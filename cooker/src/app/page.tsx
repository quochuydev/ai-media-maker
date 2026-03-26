import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThreeDMarquee } from "@/components/ThreeDMarquee";
import { config } from "@/lib/config";

// Placeholder images for the carousel (970x700 aspect ratio)
const carouselImages = [
  "https://placehold.co/970x700/141413/faf9f5?text=AI+Images",
  "https://placehold.co/970x700/d97757/faf9f5?text=Bulk+Generation",
  "https://placehold.co/970x700/6a9bcc/faf9f5?text=Text+to+Image",
  "https://placehold.co/970x700/788c5d/faf9f5?text=Cloud+Storage",
  "https://placehold.co/970x700/141413/d97757?text=Developer+API",
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-[1080px] px-4 py-8 text-center sm:py-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            AI media, instantly
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Generate stunning AI images from text prompts. Bulk generation with
            cloud storage, powered by advanced AI models.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/playground"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Try Demo
            </a>
            <a
              href={config.site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border px-8 text-sm font-medium transition-colors hover:bg-accent"
            >
              View on GitHub
            </a>
          </div>
        </section>

        {/* 3D Marquee Carousel */}
        <section className="mx-auto max-w-[1080px] px-4 py-8">
          <ThreeDMarquee images={carouselImages} />
        </section>

        {/* Stats Section */}
        <section className="mx-auto max-w-[1080px] px-4">
          <div className="grid grid-cols-2 gap-6 border-y border-border py-10 sm:py-12 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                1M+
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Images Generated
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                &lt;1s
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Response Time
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                99.9%
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                MIT
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Open Source
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-[1080px] px-4 py-8 sm:py-12">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Built for creators
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Everything you need to generate AI images at scale, from a simple
            playground to a full-featured API.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border p-6 transition-colors hover:bg-accent">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-xl text-primary-foreground">
                <span role="img" aria-hidden>
                  &#129504;
                </span>
              </div>
              <h3 className="text-lg font-semibold">AI-Powered</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Generate high-quality images from text prompts using advanced AI
                models with fine-tuned parameters.
              </p>
            </div>

            <div className="rounded-xl border border-border p-6 transition-colors hover:bg-accent">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-xl text-primary-foreground">
                <span role="img" aria-hidden>
                  &#9889;
                </span>
              </div>
              <h3 className="text-lg font-semibold">Bulk Generation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Generate up to 10 images at once with different prompts.
                Background processing keeps you productive.
              </p>
            </div>

            <div className="rounded-xl border border-border p-6 transition-colors hover:bg-accent">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-xl text-primary-foreground">
                <span role="img" aria-hidden>
                  &#128736;
                </span>
              </div>
              <h3 className="text-lg font-semibold">Developer API</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Integrate image generation into your apps with our REST API.
                Simple authentication with API keys.
              </p>
            </div>

            <div className="rounded-xl border border-border p-6 transition-colors hover:bg-accent">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-xl text-primary-foreground">
                <span role="img" aria-hidden>
                  &#127757;
                </span>
              </div>
              <h3 className="text-lg font-semibold">Cloud Storage</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Generated images are stored securely on Cloudflare R2 and
                available for instant download.
              </p>
            </div>

            <div className="rounded-xl border border-border p-6 transition-colors hover:bg-accent">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-xl text-primary-foreground">
                <span role="img" aria-hidden>
                  &#128274;
                </span>
              </div>
              <h3 className="text-lg font-semibold">Secure</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                API keys are hashed with SHA-256. All traffic encrypted. Your
                images are private by default.
              </p>
            </div>

            <div className="rounded-xl border border-border p-6 transition-colors hover:bg-accent">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-xl text-primary-foreground">
                <span role="img" aria-hidden>
                  &#128640;
                </span>
              </div>
              <h3 className="text-lg font-semibold">Scalable</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Credit-based system scales with your needs. From a single image
                to thousands via the API.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-[1080px] px-4">
          <div className="rounded-xl border border-border bg-accent py-12 text-center sm:py-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Start generating AI images in seconds. No setup required — just
              sign in and enter your prompts.
            </p>
            <div className="mt-8">
              <a
                href="/playground"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Try Playground
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
