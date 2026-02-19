import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Can Do - Find the Perfect Date Together";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Read the transparent logo file and convert to base64
  const logoPath = join(process.cwd(), "public", "logo-transparent.png");
  const logoData = await readFile(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #fff5f5 0%, #ffe0e6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Transparent Logo */}
        <img
          src={logoBase64}
          alt="Can Do"
          style={{
            height: 160,
            marginBottom: 30,
          }}
        />
        <div
          style={{
            fontSize: 40,
            color: "#666",
            fontWeight: 300,
            marginBottom: 50,
          }}
        >
          Find the perfect date together
        </div>
        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 26,
            color: "#666",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="#7c9885"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Free</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="#7c9885"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>No sign-up</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="#7c9885"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Share via link</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
