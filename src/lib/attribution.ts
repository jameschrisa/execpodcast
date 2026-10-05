// Channel attribution, computed once per full page load and attached to every
// PostHog event through `before_send`. Order of evidence:
//   1. UTM tags        (our short links and tagged posts)
//   2. Ad click IDs    (fbclid, ttclid, li_fat_id, gclid, twclid)
//   3. In-app browser  (Instagram, TikTok and LinkedIn webviews often drop the referrer)
//   4. Referrer domain
//   5. Nothing         -> direct
//
// First touch is stored once per device. Last touch follows a "last non-direct"
// model: a direct return visit keeps the previous last touch.

export type Channel =
  | "youtube"
  | "youtube_shorts"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "x"
  | "facebook"
  | "reddit"
  | "email"
  | "outreach"
  | "ai_assistant"
  | "search"
  | "referral"
  | "direct";

export type TouchSignal = "utm" | "click_id" | "in_app_browser" | "referrer" | "none";

export type Touch = {
  channel: Channel;
  signal: TouchSignal;
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  referrerDomain: string | null;
  inAppBrowser: string | null;
  paid: boolean;
  at: string;
  landingPath: string;
};

const SOURCE_ALIASES: Record<string, Channel> = {
  youtube: "youtube",
  yt: "youtube",
  youtube_shorts: "youtube_shorts",
  shorts: "youtube_shorts",
  instagram: "instagram",
  ig: "instagram",
  tiktok: "tiktok",
  tt: "tiktok",
  linkedin: "linkedin",
  li: "linkedin",
  x: "x",
  twitter: "x",
  facebook: "facebook",
  fb: "facebook",
  meta: "facebook",
  reddit: "reddit",
  newsletter: "email",
  email: "email",
  "alerts-email": "email",
  "email-signature": "email",
  outreach: "outreach",
};

const REFERRERS: [RegExp, Channel][] = [
  [/(^|\.)youtube\.com$|^youtu\.be$/, "youtube"],
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, "linkedin"],
  [/^t\.co$|(^|\.)x\.com$|(^|\.)twitter\.com$/, "x"],
  [/(^|\.)facebook\.com$|^fb\.me$|(^|\.)messenger\.com$/, "facebook"],
  [/(^|\.)reddit\.com$/, "reddit"],
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$|(^|\.)perplexity\.ai$|(^|\.)claude\.ai$|gemini\.google\.com$|copilot\.microsoft\.com$/, "ai_assistant"],
  [/(^|\.)google\.[a-z.]+$|(^|\.)bing\.com$|duckduckgo\.com$|search\.yahoo\.com$|(^|\.)ecosia\.org$|search\.brave\.com$/, "search"],
];

const IN_APP: [RegExp, string, Channel][] = [
  [/Instagram/i, "instagram", "instagram"],
  [/BytedanceWebview|musical_ly|TikTok/i, "tiktok", "tiktok"],
  [/LinkedInApp/i, "linkedin", "linkedin"],
  [/FBAN|FBAV|FB_IAB/i, "facebook", "facebook"],
  [/Twitter/i, "x", "x"],
];

const CLICK_IDS: [string, Channel][] = [
  ["ttclid", "tiktok"],
  ["li_fat_id", "linkedin"],
  ["twclid", "x"],
  ["fbclid", "facebook"],
  ["gclid", "search"],
];

const PAID_MEDIUMS = /^(cpc|ppc|paid|paid[-_]?social|display|ads?)$/i;
// fbclid rides on every outbound Meta link, organic included. The rest are ad clicks.
const PAID_CLICK_IDS = new Set(["gclid", "ttclid", "li_fat_id", "twclid"]);

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "").replace(/^m\./, "");
  } catch {
    return null;
  }
}

export function resolveTouch(href: string, referrer: string, userAgent: string): Touch {
  const url = new URL(href);
  const p = url.searchParams;
  const refDomain = referrer ? hostOf(referrer) : null;
  const internal = refDomain !== null && refDomain === url.hostname.replace(/^www\./, "");
  const inApp = IN_APP.find(([re]) => re.test(userAgent));

  const base = {
    source: p.get("utm_source"),
    medium: p.get("utm_medium"),
    campaign: p.get("utm_campaign"),
    content: p.get("utm_content"),
    referrerDomain: internal ? null : refDomain,
    inAppBrowser: inApp?.[1] ?? null,
    paid: PAID_MEDIUMS.test(p.get("utm_medium") ?? ""),
    at: new Date().toISOString(),
    landingPath: url.pathname,
  };

  if (base.source) {
    const key = base.source.toLowerCase();
    let channel: Channel = SOURCE_ALIASES[key] ?? "referral";
    const shorts = base.medium?.toLowerCase() === "shorts" || /shorts/i.test(base.content ?? "");
    if (channel === "youtube" && shorts) channel = "youtube_shorts";
    return { ...base, channel, signal: "utm" };
  }

  const click = CLICK_IDS.find(([param]) => p.has(param));
  if (click) {
    // fbclid also fires from Instagram. The webview tells us which app it was.
    const channel = click[0] === "fbclid" && inApp?.[2] === "instagram" ? "instagram" : click[1];
    return { ...base, channel, signal: "click_id", paid: PAID_CLICK_IDS.has(click[0]) || base.paid };
  }

  if (inApp) return { ...base, channel: inApp[2], signal: "in_app_browser" };

  if (base.referrerDomain) {
    const hit = REFERRERS.find(([re]) => re.test(base.referrerDomain!));
    return { ...base, channel: hit?.[1] ?? "referral", signal: "referrer" };
  }

  return { ...base, channel: "direct", signal: "none" };
}

const FIRST_KEY = "eu_first_touch";
const LAST_KEY = "eu_last_touch";

function read(key: string): Touch | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Touch) : null;
  } catch {
    return null;
  }
}

function write(key: string, touch: Touch) {
  try {
    localStorage.setItem(key, JSON.stringify(touch));
  } catch {
    // Private mode or storage disabled. Attribution still rides on this load.
  }
}

function flatten(prefix: string, t: Touch) {
  return {
    [`${prefix}_channel`]: t.channel,
    [`${prefix}_signal`]: t.signal,
    [`${prefix}_source`]: t.source,
    [`${prefix}_medium`]: t.medium,
    [`${prefix}_campaign`]: t.campaign,
    [`${prefix}_content`]: t.content,
    [`${prefix}_referrer_domain`]: t.referrerDomain,
    [`${prefix}_paid`]: t.paid,
    [`${prefix}_at`]: t.at,
  };
}

export type AttributionProps = Record<string, string | boolean | null>;

let cached: { props: AttributionProps; first: Touch; last: Touch } | null = null;

export function getAttribution() {
  if (cached) return cached;
  const current = resolveTouch(window.location.href, document.referrer, navigator.userAgent);

  const first = read(FIRST_KEY) ?? current;
  if (!read(FIRST_KEY)) write(FIRST_KEY, current);

  const previousLast = read(LAST_KEY);
  const last = current.signal === "none" && previousLast ? previousLast : current;
  if (current.signal !== "none" || !previousLast) write(LAST_KEY, last);

  const props: AttributionProps = {
    channel: current.channel,
    channel_signal: current.signal,
    in_app_browser: current.inAppBrowser,
    ...flatten("first_touch", first),
    ...flatten("last_touch", last),
  };
  cached = { props, first, last };
  return cached;
}

// Person properties to attach when a visitor identifies (submits a form).
export function attributionPersonProps() {
  const { first, last } = getAttribution();
  return {
    set: flatten("last_touch", last),
    setOnce: flatten("first_touch", first),
  };
}
