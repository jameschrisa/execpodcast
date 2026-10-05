import { cx } from "@/lib/ui";

// Square logo: "EXECUTIVE" in white over "UPSKILL" in the accent red, both set
// in the condensed display cut and sized to the same width inside a black
// square. Drawn as SVG so it stays exact at every size.
//
// Geometry (100-unit viewBox, 9-unit padding, 82 units of text width):
//   Archivo wdth 62 / 900: EXECUTIVE = 4.13em, UPSKILL = 3.094em, cap height = 0.70em
//   EXECUTIVE 19.85 units (caps 13.9), UPSKILL 26.5 units (caps 18.55), gap 4.2
//   Block height 36.65, centered: baselines at 45.6 and 68.35.
const type = {
  fontFamily: "var(--font-archivo), 'Arial Narrow', sans-serif",
  fontVariationSettings: '"wdth" 62',
  fontWeight: 900,
} as const;

export function Logo({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label="Executive Upskill"
      className={cx("logo-mark block shrink-0", className)}
    >
      <rect width="100" height="100" fill="#0e0e0e" />
      <text x="9" y="45.6" fontSize="19.85" textLength="82" lengthAdjust="spacingAndGlyphs" fill="#f2f2ee" style={type}>
        EXECUTIVE
      </text>
      <text x="9" y="68.35" fontSize="26.5" textLength="82" lengthAdjust="spacingAndGlyphs" style={{ ...type, fill: "var(--accent)" }}>
        UPSKILL
      </text>
    </svg>
  );
}
