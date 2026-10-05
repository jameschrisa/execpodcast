import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Browser-tab favicon: the logo's black square with its initials, E in white
// and U in the accent red (the full words are illegible at 16px).
export default async function Icon() {
  const anton = await readFile(join(process.cwd(), "src/assets/Anton-Regular.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0e0e",
          fontFamily: "Anton",
          fontSize: 44,
          letterSpacing: -1,
        }}
      >
        <span style={{ color: "#f2f2ee" }}>E</span>
        <span style={{ color: "#ff4d12" }}>U</span>
      </div>
    ),
    { ...size, fonts: [{ name: "Anton", data: anton, weight: 400, style: "normal" }] },
  );
}
