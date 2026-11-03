import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { PageInstrumentation } from "@/components/analytics/PageInstrumentation";
import { ContactForm } from "@/components/contact/ContactForm";
import { CompactNav } from "@/components/site/CompactNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { contact } from "@/content/contact";
import { pageMetadata } from "@/lib/metadata";
import { container, cx } from "@/lib/ui";

export function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  return pageMetadata(parent, { path: "/contact", title: "Contact", description: contact.description });
}

export default function ContactPage() {
  return (
    <div className="relative">
      <CompactNav />
      <SiteHeader />
      <main className={cx(container, "max-w-[860px] pb-4 pt-12 md:pt-16")}>
        <h1 className="font-display text-[clamp(56px,9vw,120px)]">Contact</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">{contact.intro}</p>
        <div className="mt-10 rounded-2xl border border-line bg-raised p-5 md:p-10">
          <ContactForm />
        </div>
        <p className="mt-8 text-[14px] text-muted">
          <Link href="/" className="underline decoration-line underline-offset-4 hover:decoration-current">
            Back to the show
          </Link>
        </p>
      </main>
      <SiteFooter />
      <PageInstrumentation />
    </div>
  );
}
