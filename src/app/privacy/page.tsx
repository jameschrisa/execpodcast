import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { container, cx } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Executive Upskill collects on this site and why.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    h: "What we measure",
    p: [
      "We use PostHog to see how people use this site: which pages and sections you view, which buttons and links you click, how far you scroll, and page performance. PostHog may record your session so we can find confusing parts of the page. Session recordings mask everything you type into form fields.",
      "If your browser sends a Do Not Track signal, we don't collect analytics.",
    ],
  },
  {
    h: "Where you came from",
    p: [
      "When you arrive from YouTube, Instagram, TikTok, LinkedIn or another site, we note the channel (from the link's tracking tags, the referring site or the app's built-in browser) so we know which posts bring people here. We keep your first and most recent channel in your browser's local storage.",
    ],
  },
  {
    h: "What you send us",
    p: [
      "When you sign up for premiere alerts, send a question or pitch a guest, we keep what you enter in the form and link it to your visit so we can reply and see which channels bring listeners. We use your email for show updates and replies. We don't sell or share it.",
      "Each email has a one-click unsubscribe. To have your data deleted, reply to any of our emails and ask.",
    ],
  },
  {
    h: "Other sites",
    p: [
      "Links to YouTube, Instagram, TikTok, LinkedIn and the F3 Insights events pages take you to sites with their own privacy policies. Registration for F3 Insights sessions happens on their site.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className={cx(container, "max-w-[860px] py-16 md:py-24")}>
      <Link href="/" aria-label="Executive Upskill home" className="block w-fit">
        <Logo size={64} />
      </Link>
      <h1 className="font-display mt-6 text-[clamp(56px,9vw,120px)]">Privacy</h1>
      <p className="mt-4 text-[15px] text-muted">Last updated October 3, 2026</p>
      <div className="mt-10 grid gap-10">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-[22px] font-bold">{s.h}</h2>
            {s.p.map((para) => (
              <p key={para.slice(0, 24)} className="mt-3 max-w-[65ch] text-[17px] leading-relaxed text-ink-soft">
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
