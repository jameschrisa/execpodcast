#!/usr/bin/env node
// Render SVG files to PNG at their own width/height (no system fonts needed,
// all text in the brand SVGs is outlined).
// Usage: RESVG_DIR=/path/to/dir-containing-node_modules node render-svg.mjs in.svg [out.png] ...
//   Pass pairs "in.svg:out.png" or just "in.svg" (writes next to it).
// Install once: npm i --prefix "$RESVG_DIR" @resvg/resvg-js@2.6.2
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
const dir = process.env.RESVG_DIR;
if (!dir) { console.error("Set RESVG_DIR to a folder with @resvg/resvg-js installed"); process.exit(1); }
const { Resvg } = createRequire(dir.replace(/\/?$/, "/") + "x.js")("@resvg/resvg-js");
for (const arg of process.argv.slice(2)) {
  const [src, dst] = arg.includes(":") ? arg.split(":") : [arg, arg.replace(/\.svg$/, ".png")];
  const r = new Resvg(readFileSync(src), { fitTo: { mode: "original" }, font: { loadSystemFonts: false } });
  writeFileSync(dst, r.render().asPng());
  console.log("png", dst);
}
