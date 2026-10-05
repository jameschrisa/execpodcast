// Link-in-bio short paths (302). Put these in bios, end cards, video
// descriptions and email signatures. Each redirect stamps UTMs so the visit
// lands in PostHog with a channel, even from in-app browsers that drop the referrer.
//
// Convention (lowercase, hyphens inside values, underscores between parts)
//   utm_source    youtube | instagram | tiktok | linkedin | outreach | email-signature | alerts-email
//   utm_medium    social | paid-social | email | referral
//   utm_campaign  eu_evergreen (bios) | eu_s1_e01 ... eu_s1_e12 (per episode)
//   utm_content   placement_detail, e.g. live-desc, li-post_james, story_e01-03
//
// Repoint CURRENT_EPISODE each week so /ys, /live, /chat and /ask credit the
// episode that is airing.

export type ShortLink = { path: string; destination: string; label: string };

const CURRENT_EPISODE = "eu_s1_e01";

function link(source: string, medium: string, campaign: string, content: string, hash = "") {
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign,
    utm_content: content,
  });
  return `/?${params.toString()}${hash}`;
}

export const shortLinks: ShortLink[] = [
  { path: "/yt", destination: link("youtube", "social", "eu_evergreen", "channel-link"), label: "YouTube channel header link and About" },
  { path: "/ys", destination: link("youtube", "social", CURRENT_EPISODE, "shorts-endcard"), label: "On-screen end card on Shorts" },
  { path: "/live", destination: link("youtube", "social", CURRENT_EPISODE, "live-desc"), label: "YouTube Live description" },
  { path: "/chat", destination: link("youtube", "social", CURRENT_EPISODE, "live-chat"), label: "Pinned message in the live chat" },
  { path: "/ig", destination: link("instagram", "social", "eu_evergreen", "bio"), label: "Instagram bio and Reels end card" },
  { path: "/tt", destination: link("tiktok", "social", "eu_evergreen", "bio"), label: "TikTok bio and clip end card" },
  { path: "/li", destination: link("linkedin", "social", "eu_evergreen", "company-page"), label: "Show LinkedIn page" },
  { path: "/li-james", destination: link("linkedin", "social", "eu_evergreen", "li-featured_james"), label: "James's LinkedIn Featured and About" },
  { path: "/li-greg", destination: link("linkedin", "social", "eu_evergreen", "li-featured_greg"), label: "Greg's LinkedIn Featured and About" },
  { path: "/li-bryce", destination: link("linkedin", "social", "eu_evergreen", "li-featured_bryce"), label: "Bryce's LinkedIn Featured and About" },
  { path: "/ask", destination: link("youtube", "social", CURRENT_EPISODE, "on-air", "#ask"), label: "Said on air and shown as a lower third" },
  { path: "/pitch", destination: link("outreach", "referral", "eu_evergreen", "pitch-link", "#pitch"), label: "Founder outreach and host DMs" },
  { path: "/alerts", destination: link("email-signature", "email", "eu_evergreen", "signature", "#participate"), label: "Email signatures, slides, QR codes" },
];
