import { ImageResponse } from "next/og";

export const runtime = "edge";

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
          fontSize: 20,
          background: "linear-gradient(135deg, #1e3a8a, #4338ca, #3b82f6)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          borderRadius: "8px",
          fontWeight: 900,
          fontFamily: "system-ui, sans-serif",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  );
}
