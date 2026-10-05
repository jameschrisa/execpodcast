import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon: the full square logo. Anton stands in for the site's
// condensed Archivo (the image renderer can't read variable fonts). Sizes put
// both words at the same 148px width: EXECUTIVE is 3.75em, UPSKILL 2.9em.
export default async function AppleIcon() {
  const anton = await readFile(join(process.cwd(), "src/assets/Anton-Regular.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#0e0e0e",
          padding: "0 16px",
          fontFamily: "Anton",
        }}
      >
        <div style={{ display: "flex", fontSize: 39.5, lineHeight: 1, color: "#f2f2ee" }}>EXECUTIVE</div>
        <div style={{ display: "flex", fontSize: 51, lineHeight: 1, marginTop: -2, color: "#ff4d12" }}>UPSKILL</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Anton", data: anton, weight: 400, style: "normal" }] },
  );
}
