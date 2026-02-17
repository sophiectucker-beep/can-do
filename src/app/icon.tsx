import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#e89999",
            fontFamily: "Georgia, serif",
            textShadow: "0 0 1px #d48a8a",
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
