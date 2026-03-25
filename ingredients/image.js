import { Client } from "@gradio/client";
import fs from "fs";
import path from "path";

const SPACE_URL = "mrfakename/Z-Image-Turbo";

async function generateImage(options = {}) {
  const {
    prompt = "A beautiful sunset over the ocean",
    height = 1024,
    width = 1024,
    numInferenceSteps = 9,
    seed = 0,
    randomizeSeed = true,
    outputPath = `output-${Date.now()}.png`,
  } = options;

  console.log(`Connecting to HuggingFace Space: ${SPACE_URL}...`);
  const client = await Client.connect(SPACE_URL);

  console.log(`Generating image for prompt: "${prompt}"`);
  console.log(
    `Settings: ${width}x${height}, steps: ${numInferenceSteps}, seed: ${randomizeSeed ? "random" : seed}`,
  );

  const result = await client.predict("/generate_image", {
    prompt,
    height,
    width,
    num_inference_steps: numInferenceSteps,
    seed,
    randomize_seed: randomizeSeed,
  });

  const [imageData, usedSeed] = result.data;
  console.log(`Image generated! Seed used: ${usedSeed}`);

  // imageData is an object with a url property
  if (imageData?.url) {
    const response = await fetch(imageData.url);
    const buffer = Buffer.from(await response.arrayBuffer());
    const outputFile = path.resolve(outputPath);
    fs.writeFileSync(outputFile, buffer);
    console.log(`Image saved to: ${outputFile}`);
  } else {
    console.error("Unexpected response format:", imageData);
  }
}

// Parse CLI arguments
const args = process.argv.slice(2);
const prompt =
  args.join(" ") || "A futuristic cityscape at night with neon lights";

generateImage({ prompt }).catch(console.error);
