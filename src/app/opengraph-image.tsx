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
          background: "#FFFFFF",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Logo text styled to match brand */}
        <div
          style={{
            fontSize: 120,
            fontStyle: "italic",
            fontWeight: 400,
            color: "#d4a5a5",
            marginBottom: 20,
            textShadow: "2px 2px 0 #c49393",
          }}
        >
          Can Do
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#666",
            fontWeight: 300,
            marginBottom: 50,
            fontFamily: "sans-serif",
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
            fontFamily: "sans-serif",
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
