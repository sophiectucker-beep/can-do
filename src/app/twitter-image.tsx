import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Can Do - Find the Perfect Date Together";
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
        <div
          style={{
            fontSize: 120,
            fontWeight: "bold",
            color: "#e89999",
            marginBottom: 20,
            textShadow: "2px 2px 0 #d48a8a",
          }}
        >
          Can Do
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#666",
            fontWeight: 300,
            marginBottom: 40,
          }}
        >
          Find the perfect date together
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 24,
            color: "#888",
          }}
        >
          <span>✓ Free</span>
          <span>•</span>
          <span>✓ No sign-up</span>
          <span>•</span>
          <span>✓ Share via link</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
