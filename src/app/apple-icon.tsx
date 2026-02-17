import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#fff5f5",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
        }}
      >
        <span
          style={{
            fontSize: 140,
            fontWeight: "bold",
            color: "#e89999",
            fontFamily: "Georgia, serif",
            textShadow: "0 0 2px #d48a8a",
          }}
        >
          C
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
