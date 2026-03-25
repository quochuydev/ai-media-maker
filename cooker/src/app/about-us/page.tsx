import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { config } from "@/lib/config";

export default function AboutUsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-[1080px] px-4 py-8 sm:py-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About Us
          </h1>
          <div className="mt-8 space-y-6 text-muted-foreground">
            <p>
              AI Media Maker is an AI-powered media generation platform that
              lets you create stunning images from text prompts. We provide
              bulk generation, cloud storage, and developer APIs.
            </p>
            <p>
              Our mission is to make AI image generation accessible to
              everyone — from individual creators to large teams building
              media-rich applications.
            </p>
            <p>
              Built on advanced AI models, AI Media Maker handles everything
              from prompt processing to secure cloud storage, so you can focus
              on creating.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Business Opportunities</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We partner with businesses to integrate AI image generation
                into their products and workflows. Whether you need custom
                solutions or enterprise-scale generation, we can help.
              </p>
              <div className="rounded-lg border border-border bg-accent/50 p-6">
                <h3 className="mb-3 font-semibold text-foreground">
                  What we offer:
                </h3>
                <ul className="list-inside list-disc space-y-2">
                  <li>Bulk AI image generation via API</li>
                  <li>Secure cloud storage on Cloudflare R2</li>
                  <li>Custom integration and consulting</li>
                  <li>Enterprise volume pricing and SLAs</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Contact</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: {config.site.email}</p>
              <p>GitHub: {config.site.github.replace("https://", "")}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
