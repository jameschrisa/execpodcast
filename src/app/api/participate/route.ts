import { PostHog } from "posthog-node";

// Receives the three participation forms (premiere alerts, questions for the
// live show, guest pitches). Each submission is:
//   1. captured server-side in PostHog as `lead_captured` on the person (email)
//   2. forwarded as JSON to LEADS_WEBHOOK_URL when set (Zapier, Make, Slack,
//      HubSpot workflow, Google Apps Script, etc.)

type Kind = "alerts" | "question" | "pitch";

type Payload = {
  kind: Kind;
  email: string;
  name?: string;
  role?: string;
  question?: string;
  host?: string;
  anonymous?: boolean;
  relation?: string;
  guestName?: string;
  guestRole?: string;
  guestLink?: string;
  why?: string;
  episodeInterest?: string;
  distinctId?: string;
  attribution?: Record<string, unknown>;
  website?: string; // honeypot
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS: Partial<Record<keyof Payload, number>> = {
  name: 120,
  role: 60,
  question: 600,
  host: 20,
  guestName: 120,
  guestRole: 160,
  guestLink: 300,
  why: 1000,
  episodeInterest: 160,
  relation: 20,
};

// Simple per-instance throttle. Good enough to blunt a script hammering the
// endpoint; use a shared store (Upstash, KV) if abuse shows up.
const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : undefined;
}

function validate(body: unknown): { data?: Payload; error?: string } {
  if (!body || typeof body !== "object") return { error: "invalid_body" };
  const b = body as Record<string, unknown>;
  const kind = b.kind;
  if (kind !== "alerts" && kind !== "question" && kind !== "pitch") return { error: "invalid_kind" };
  const email = str(b.email, 254);
  if (!email || !EMAIL.test(email)) return { error: "invalid_email" };

  const data: Payload = { kind, email: email.toLowerCase() };
  for (const [field, max] of Object.entries(LIMITS)) {
    const value = str(b[field], max!);
    if (value) (data as Record<string, unknown>)[field] = value;
  }
  data.anonymous = b.anonymous === true;
  data.website = str(b.website, 200);
  data.distinctId = str(b.distinctId, 200);
  if (b.attribution && typeof b.attribution === "object") data.attribution = b.attribution as Record<string, unknown>;

  if (kind === "question" && !data.question) return { error: "missing_question" };
  if (kind === "pitch" && (!data.guestName || !data.why)) return { error: "missing_pitch" };
  return { data };
}

async function captureInPostHog(data: Payload) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return false;
  const region = process.env.NEXT_PUBLIC_POSTHOG_REGION === "eu" ? "eu" : "us";
  const client = new PostHog(key, { host: `https://${region}.i.posthog.com`, flushAt: 1, flushInterval: 0 });
  // The browser already called identify(email), which merges the anonymous
  // session into this person. Capture against the email so they line up.
  const { attribution, distinctId: _anon, website: _honeypot, email, ...rest } = data;
  void _honeypot;
  void _anon;
  client.capture({
    distinctId: email,
    event: "lead_captured",
    properties: {
      ...rest,
      ...(attribution ?? {}),
      $set: { email, name: data.name, role: data.role },
    },
  });
  await client.shutdown();
  return true;
}

async function forwardToWebhook(data: Payload) {
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return false;
  const { website: _honeypot, distinctId: _id, ...rest } = data;
  void _honeypot;
  void _id;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...rest, submittedAt: new Date().toISOString(), site: "executive-upskill" }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const body = await request.json().catch(() => null);
  const { data, error } = validate(body);
  if (!data) return Response.json({ ok: false, error }, { status: 400 });

  // Bots fill every field. Pretend success so they move on.
  if (data.website) return Response.json({ ok: true });

  const results = await Promise.allSettled([captureInPostHog(data), forwardToWebhook(data)]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value === true);
  const failed = results.filter((r) => r.status === "rejected");
  for (const f of failed) console.error("[participate] delivery failed", (f as PromiseRejectedResult).reason);

  if (!delivered) {
    if (failed.length > 0) return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    // No PostHog key and no webhook. In production that would drop leads
    // silently, so refuse instead; in local dev, log the submission.
    if (process.env.NODE_ENV === "production") {
      console.error("[participate] no lead destination configured (set NEXT_PUBLIC_POSTHOG_KEY or LEADS_WEBHOOK_URL)");
      return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
    }
    console.info("[participate] no destination configured, submission:", { ...data, website: undefined });
  }
  return Response.json({ ok: true });
}
