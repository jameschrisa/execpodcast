import type { Metadata, Viewport } from "next";
import { Archivo, Geist } from "next/font/google";
import { show } from "@/content/show";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const description =
  "A brand operator, a finance executive and a venture investor argue AI, money and brand live on YouTube. Get premiere alerts.";

export const metadata: Metadata = {
  metadataBase: new URL(show.siteUrl),
  title: {
    default: "Executive Upskill: a live video podcast on AI, money and brand",
    template: "%s | Executive Upskill",
  },
  description,
  applicationName: show.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: show.name,
    title: "Executive Upskill",
    description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Executive Upskill",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f7f5",
};

// Light by default for every visitor, whatever the OS setting. Runs before
// first paint and only switches to dark if the visitor chose it with the toggle.
const themeScript = `(function(){try{if(localStorage.getItem('eu-theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" className={`${archivo.variable} ${geist.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain min-h-[100dvh] bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
