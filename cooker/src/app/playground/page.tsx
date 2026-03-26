"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect, Suspense, FormEvent } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";

interface ImageJobItem {
  id: string;
  prompt: string;
  status: string;
  imageUrl: string | null;
  error: string | null;
}

interface ImageJob {
  id: string;
  totalImages: number;
  completedImages: number;
  failedImages: number;
  status: string;
  createdAt: string;
}

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<PlaygroundLoading />}>
      <PlaygroundContent />
    </Suspense>
  );
}

function PlaygroundLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-[1080px] px-4 py-8 sm:py-12">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Playground</h1>
          </div>
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function PlaygroundContent() {
  const { isSignedIn, isLoaded: authLoaded } = useUser();

  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<ImageJob | null>(null);
  const [activeJobItems, setActiveJobItems] = useState<ImageJobItem[]>([]);
  const [pollingId, setPollingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    fetch("/api/billing")
      .then((res) => res.json())
      .then((data) => {
        setCredits(data.credits);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [authLoaded, isSignedIn]);

  // Poll active job status
  useEffect(() => {
    if (!pollingId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/playground/images/${pollingId}`);
        const data = await res.json();
        if (res.ok) {
          setActiveJob(data.job);
          setActiveJobItems(data.items);
          if (
            data.job.status === "completed" ||
            data.job.status === "failed"
          ) {
            setPollingId(null);
          }
        }
      } catch {
        // continue polling
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [pollingId]);

  const addPrompt = () => {
    if (prompts.length < 10) {
      setPrompts([...prompts, ""]);
    }
  };

  const removePrompt = (index: number) => {
    if (prompts.length > 1) {
      setPrompts(prompts.filter((_, i) => i !== index));
    }
  };

  const updatePrompt = (index: number, value: string) => {
    const updated = [...prompts];
    updated[index] = value;
    setPrompts(updated);
  };

  const validPrompts = prompts.filter((p) => p.trim().length > 0);
  const creditsRequired = validPrompts.length;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validPrompts.length === 0 || submitting || !isSignedIn) return;

    setSubmitting(true);
    setError(null);
    setActiveJob(null);
    setActiveJobItems([]);

    try {
      const res = await fetch("/api/playground/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompts: validPrompts }),
      });

      const data = await res.json();

      if (res.ok) {
        setCredits(data.credits);
        setPollingId(data.jobId);
        setActiveJob({
          id: data.jobId,
          totalImages: data.totalImages,
          completedImages: 0,
          failedImages: 0,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      } else {
        setError(data.error || "Failed to start image generation");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-[1080px] px-4 py-8 sm:py-12">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Playground</h1>
            {isSignedIn && (
              <div className="rounded-lg bg-accent px-4 py-2 text-sm">
                Credits:{" "}
                <span className="font-semibold">
                  {loading ? "..." : credits ?? 0}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-accent/50 p-8">
              <h2 className="text-xl font-semibold">
                Bulk Image Generation
              </h2>
              <p className="mt-2 text-muted-foreground">
                Enter prompts to generate AI images. 1 credit per image, up to
                10 images per batch.
              </p>

              {!authLoaded || loading ? (
                <div className="mt-6 flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
                  <p className="text-muted-foreground">
                    {!authLoaded
                      ? "Checking authentication..."
                      : "Loading credits..."}
                  </p>
                </div>
              ) : !isSignedIn ? (
                <div className="mt-6 text-center">
                  <p className="mb-4 text-muted-foreground">
                    Sign in to start generating images
                  </p>
                  <SignInButton mode="modal">
                    <button className="cursor-pointer rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90">
                      Sign In to Start
                    </button>
                  </SignInButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="space-y-3">
                    {prompts.map((prompt, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="flex h-11 w-8 shrink-0 items-center justify-center text-sm text-muted-foreground">
                          {index + 1}.
                        </span>
                        <input
                          type="text"
                          value={prompt}
                          onChange={(e) => updatePrompt(index, e.target.value)}
                          placeholder="Describe the image you want to generate..."
                          className="flex-1 rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-foreground"
                          disabled={submitting}
                        />
                        {prompts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePrompt(index)}
                            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                            disabled={submitting}
                          >
                            X
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={addPrompt}
                      disabled={prompts.length >= 10 || submitting}
                      className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      + Add another prompt ({prompts.length}/10)
                    </button>

                    <div className="flex items-center gap-4">
                      {validPrompts.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {creditsRequired} credit{creditsRequired !== 1 ? "s" : ""} required
                        </span>
                      )}
                      <button
                        type="submit"
                        disabled={
                          submitting ||
                          validPrompts.length === 0 ||
                          (credits !== null && credits < creditsRequired)
                        }
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            Submitting...
                          </>
                        ) : (
                          "Generate Images"
                        )}
                      </button>
                    </div>
                  </div>

                  {credits !== null && credits < creditsRequired && validPrompts.length > 0 && (
                    <p className="text-sm text-destructive">
                      Insufficient credits. You need {creditsRequired} but have{" "}
                      {credits}.{" "}
                      <a
                        href="/c/cloud/billing"
                        className="underline hover:no-underline"
                      >
                        Buy more credits
                      </a>
                    </p>
                  )}
                </form>
              )}

              {error && (
                <div className="mt-4 rounded-lg bg-destructive/10 p-4 text-destructive">
                  {error}
                </div>
              )}
            </div>

            {activeJob && (
              <div className="rounded-xl border border-border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">
                    Job Status:{" "}
                    <span className="capitalize">{activeJob.status}</span>
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {activeJob.completedImages + activeJob.failedImages}/
                    {activeJob.totalImages} processed
                  </span>
                </div>

                <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${((activeJob.completedImages + activeJob.failedImages) / activeJob.totalImages) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeJobItems.map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-lg border border-border"
                    >
                      {item.status === "completed" && item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.prompt}
                          className="aspect-square w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center bg-accent/50">
                          {item.status === "failed" ? (
                            <span className="px-4 text-center text-sm text-destructive">
                              Failed: {item.error}
                            </span>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-6 w-6 animate-spin rounded-full border-3 border-muted border-t-foreground" />
                              <span className="text-xs text-muted-foreground capitalize">
                                {item.status}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-3">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {item.prompt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-semibold">AI-Powered</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate high-quality images using advanced AI models
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-semibold">Bulk Generation</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate up to 10 images at once with different prompts
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-semibold">Cloud Storage</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Images stored securely and available for download
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
