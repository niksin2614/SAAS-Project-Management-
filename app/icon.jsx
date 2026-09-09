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
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090d16",
          borderRadius: "8px",
          border: "1px solid #1e293b",
          position: "relative",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path
            d="M7 16C7 11.029 11.029 7 16 7C19.5 7 22.5 9 24.2 12L20.6 13.8C19.5 11.8 17.8 10.8 16 10.8C13.128 10.8 10.8 13.128 10.8 16C10.8 17.2 11.2 18.3 12 19.2L8.9 21.6C7.7 20 7 18.1 7 16Z"
            fill="#38bdf8"
          />
          <path
            d="M25 16C25 20.971 20.971 25 16 25C12.5 25 9.5 23 7.8 20L11.4 18.2C12.5 20.2 14.2 21.2 16 21.2C18.872 21.2 21.2 18.872 21.2 16C21.2 14.8 20.8 13.7 20 12.8L23.1 10.4C24.3 12 25 13.9 25 16Z"
            fill="#818cf8"
          />
          <circle cx="16" cy="16" r="2.5" fill="#38bdf8" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
