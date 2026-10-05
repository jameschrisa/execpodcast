import type { PlatformId } from "./show";

export const nav = [
  { label: "Watch", href: "#watch" },
  { label: "Episodes", href: "#lenses" },
  { label: "Hosts", href: "#hosts" },
  { label: "Live sessions", href: "#sessions" },
  { label: "Ask the hosts", href: "#ask" },
] as const;

export const hero = {
  valueProp: "Three operators argue AI, money and brand from the seats they've held. Live on YouTube, clipped for your feed.",
};

export const ticker = [
  "AI agents on the org chart",
  "Human review, built in",
  "Margin math on AI pilots",
  "Chatbots as brand voice",
  "Board questions about AI",
  "A venture fund run on agents",
  "Month-end close, automated",
  "Moats you can't prompt",
  "Blockchain's second act",
  "Pop culture as market signal",
];

export const platforms: Record<
  PlatformId,
  { name: string; reason: string; cta: string }
> = {
  youtube: {
    name: "YouTube Live",
    reason: "Watch the full episode live and ask in the chat while the hosts can still answer.",
    cta: "Subscribe on YouTube",
  },
  shorts: {
    name: "YouTube Shorts",
    reason: "One argument per clip, short enough for the gap between meetings.",
    cta: "Watch Shorts",
  },
  instagram: {
    name: "Instagram",
    reason: "Reels of the sharpest exchanges, plus behind-the-set Stories.",
    cta: "Follow on Instagram",
  },
  tiktok: {
    name: "TikTok",
    reason: "Fast cuts of the moments the hosts disagree, ready for you to stitch.",
    cta: "Follow on TikTok",
  },
};

// "Pairs with" links each affiliated session to the episode it follows from.
// Keys are lowercase session names. Card lines override the source blurb.
export const sessionNotes: Record<string, { line?: string; pairsWith?: number }> = {
  "coffee and ai coding": { line: "Weekly show-and-tell. Bring what you built, or come to watch.", pairsWith: 3 },
  "getting set up with ai tools": { line: "Get your AI tools installed and working before you need them.", pairsWith: 1 },
  "ai and excel for forecasting": { line: "Bring AI into the spreadsheet you forecast in.", pairsWith: 1 },
  "managing ai context and memory": { line: "Control what your AI tools remember between conversations.", pairsWith: 3 },
  "variance analysis automation": { line: "Have AI draft the budget-versus-actual explanations you write each month.", pairsWith: 11 },
  "automated meeting notes": { line: "Turn meeting recordings into decisions and follow-ups you can send.", pairsWith: 8 },
  "sharing ai skills across your team": { line: "Package what works for you so your team can reuse it.", pairsWith: 8 },
  "month-end close automation": { line: "Map your close and pick the first steps to automate.", pairsWith: 7 },
  "ai for executive reporting": { line: "Draft leadership reports from your own numbers.", pairsWith: 11 },
  "ai security and governance": { line: "Set the rules for who uses which AI tools on which data.", pairsWith: 2 },
  "task and project visibility": { pairsWith: 8 },
  "using ai well in an smb": { pairsWith: 1 },
  "getting your data ready for ai": { pairsWith: 4 },
  "connecting ai to your software": { pairsWith: 3 },
  "traceability in ai-assisted f&a": { pairsWith: 2 },
  "ai and numerical data": { pairsWith: 11 },
  "using claude.md and agents.md files": { pairsWith: 8 },
};

export const faq = [
  {
    q: "When does Executive Upskill air?",
    a: "The premiere streams on YouTube Live on {PREMIERE}. New episodes follow on a regular schedule we'll announce to the alerts list first. Get premiere alerts and we'll email you the day before and again when we go live.",
  },
  {
    q: "Can I join live?",
    a: "Yes. Open the stream on YouTube, sign in and post in the live chat. The hosts take questions from the chat during the show. If you miss it, the replay stays at the same link.",
  },
  {
    q: "How do I get my question on air?",
    a: "Send it through the question form on this page before the cutoff shown there, or post it in the live chat during the show. The hosts pick questions that name a real decision and give enough context to argue about. You can ask us to read yours without your name.",
  },
  {
    q: "Who should pitch as a guest?",
    a: "Founders and operators who made a hard call on AI, money or brand and will defend it on camera. You can pitch yourself or someone you know.",
  },
  {
    q: "Is it free, and where can I watch?",
    a: "Yes, it's free. Watch full episodes live or on replay on YouTube, and find short clips on YouTube Shorts, Instagram and TikTok. The affiliated F3 Insights sessions are free too, and you register for them on the F3 Insights site.",
  },
];
