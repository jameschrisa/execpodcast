import type { CSSProperties } from "react";
import { cx } from "@/lib/ui";

// Linocut prints are single-color SVGs. Rendering them as a CSS mask lets them
// take the surrounding text color, so they invert with the theme and the panels.
export function Art({
  src,
  alt,
  ratio,
  className,
}: {
  src: string;
  alt: string;
  ratio: number;
  className?: string;
}) {
  const style: CSSProperties = {
    aspectRatio: ratio,
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };
  return <span role="img" aria-label={alt} className={cx("block bg-current", className)} style={style} />;
}

export const artRatios: Record<string, number> = {
  "/art/microphone.svg": 476 / 970,
  "/art/megaphone.svg": 903 / 901,
  "/art/adding-machine.svg": 884 / 938,
  "/art/knight.svg": 567 / 939,
};
