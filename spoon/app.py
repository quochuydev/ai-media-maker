import gradio as gr
import torch
import random
from diffusers import AutoencoderKLWan, WanPipeline
from diffusers.schedulers.scheduling_unipc_multistep import UniPCMultistepScheduler
from diffusers.utils import export_to_video

MODEL_ID = "Wan-AI/Wan2.1-T2V-1.3B-Diffusers"

vae = AutoencoderKLWan.from_pretrained(MODEL_ID, subfolder="vae", torch_dtype=torch.float32)
pipe = WanPipeline.from_pretrained(MODEL_ID, vae=vae, torch_dtype=torch.bfloat16)
pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config, flow_shift=3.0)
pipe.to("cuda")

def generate(prompt, negative_prompt="", height=480, width=832, num_frames=33, num_inference_steps=30, guidance_scale=5.0, seed=-1):
    if seed == -1:
        seed = random.randint(0, 2**32 - 1)

    generator = torch.Generator(device="cuda").manual_seed(seed)

    output = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt if negative_prompt else None,
        height=height,
        width=width,
        num_frames=num_frames,
        num_inference_steps=num_inference_steps,
        guidance_scale=guidance_scale,
        generator=generator,
    ).frames[0]

    video_path = export_to_video(output, fps=16)
    return video_path, seed

with gr.Blocks() as demo:
    gr.Markdown("# Wan2.1 T2V 1.3B - Text to Video")
    with gr.Row():
        with gr.Column():
            prompt = gr.Textbox(label="Prompt", lines=3)
            negative_prompt = gr.Textbox(label="Negative Prompt", value="Distorted, blurry, low resolution, motionless")
            with gr.Row():
                height = gr.Number(label="Height", value=480)
                width = gr.Number(label="Width", value=832)
            with gr.Row():
                num_frames = gr.Number(label="Frames", value=33)
                steps = gr.Number(label="Steps", value=30)
            with gr.Row():
                guidance = gr.Number(label="Guidance Scale", value=5.0)
                seed = gr.Number(label="Seed (-1 = random)", value=-1)
            btn = gr.Button("Generate", variant="primary")
        with gr.Column():
            video = gr.Video(label="Generated Video")
            seed_used = gr.Number(label="Seed Used")

    btn.click(fn=generate, inputs=[prompt, negative_prompt, height, width, num_frames, steps, guidance, seed], outputs=[video, seed_used], api_name="generate")

demo.launch()
