import { ImageResponse } from "next/og";
import { config } from "@/lib/config";

export const runtime = "edge";

export const alt = `${config.site.name} - ${config.site.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #141413 0%, #1e1e1c 100%)",
          fontFamily: "Poppins, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "#faf9f5",
              margin: 0,
              marginBottom: 16,
            }}
          >
            {config.site.name}
          </h1>
          <p
            style={{
              fontSize: 32,
              color: "#b0aea5",
              margin: 0,
              marginBottom: 40,
            }}
          >
            {config.site.tagline}
          </p>
          <div
            style={{
              width: 400,
              height: 4,
              borderRadius: 2,
              background: "linear-gradient(90deg, #d97757 0%, #6a9bcc 100%)",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
