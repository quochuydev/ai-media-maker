import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function CloudLandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-[1080px] px-4 py-8 text-center sm:py-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            AI Media Maker Cloud
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Access powerful AI image generation APIs. Generate images
            programmatically with simple REST calls and manage everything from your dashboard.
          </p>

          <div className="mt-10">
            <Link
              href="/c/cloud/api-keys"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-[1080px] px-4 py-16">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-xl text-primary-foreground">
                  &#9889;
                </div>
                <h3 className="font-semibold">Lightning Fast</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Images generated in seconds with background processing for
                  bulk requests.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-xl text-primary-foreground">
                  &#128272;
                </div>
                <h3 className="font-semibold">Secure by Default</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  API keys hashed with SHA-256. Images stored securely on
                  Cloudflare R2. All traffic encrypted.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-xl text-primary-foreground">
                  &#128200;
                </div>
                <h3 className="font-semibold">Scale Effortlessly</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Credit-based billing scales with your usage. Generate one
                  image or thousands via the API.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
