import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { show } from "@/content/show";
import { shortDate } from "@/lib/time";

export const shareSize = { width: 1200, height: 630 };
export const shareAlt = "Executive Upskill: James Christopher, Greg Fisher and Bryce Gilleland on a video call. Live on YouTube.";

// Social share card: wordmark and premiere date beside the three hosts on a call.
export async function renderShareImage() {
  // Satori can't read variable fonts, so the card sets everything in Anton.
  const [anton, photo] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/Anton-Regular.ttf")),
    readFile(join(process.cwd(), "public/photos/call-gallery.jpg")),
  ]);
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#161618", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={620}
          height={349}
          style={{ position: "absolute", right: 40, top: 140, borderRadius: 18, objectFit: "cover" }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 0 56px 60px", width: 520 }}>
          <div style={{ display: "flex", fontFamily: "Anton", fontSize: 26, color: "#ff4d12", letterSpacing: 2, textTransform: "uppercase" }}>
            Live video podcast
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "Anton", fontSize: 112, lineHeight: 0.92, color: "#f2f2ee" }}>EXECUTIVE</div>
            <div style={{ display: "flex", fontFamily: "Anton", fontSize: 112, lineHeight: 0.92, color: "#ff4d12" }}>UPSKILL</div>
            <div style={{ display: "flex", marginTop: 24, fontFamily: "Anton", fontSize: 36, color: "#f2f2ee", textTransform: "uppercase" }}>
              {show.campaignLine}
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Anton", fontSize: 26, color: "rgba(242,242,238,0.8)", textTransform: "uppercase", letterSpacing: 1 }}>
            Premieres {shortDate(show.premiereAt)} on YouTube Live
          </div>
        </div>
      </div>
    ),
    {
      ...shareSize,
      fonts: [
        { name: "Anton", data: anton, weight: 400, style: "normal" },
      ],
    },
  );
}
