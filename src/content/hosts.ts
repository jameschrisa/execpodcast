export type HostId = "james" | "greg" | "bryce";
export type LensId = "brand" | "money" | "venture";

export type Host = {
  id: HostId;
  name: string;
  firstName: string;
  role: string;
  lens: LensId;
  lensLabel: string;
  linkedin: string;
  // Hero card question, set as live text over the photo.
  hook: string;
  bio: string;
  asksFirst: string;
  // Candid home-studio takes: three-quarter at the mic, laughing side profile,
  // and a square face crop of the laughing take for avatars.
  // card is the hero card at rest (laugh shows on hover); cam is the webcam
  // frame used in the video-call section.
  photos: { card: string; talk: string; laugh: string; avatar: string; cam: string };
};

// suffix "-real" points at real photos (scripts/real-photos.py) instead of
// the generated set (scripts/retouch.py).
function photos(id: HostId, suffix = "", { card = false } = {}) {
  return {
    card: `/photos/${id}-${card ? "card" : "talk"}${suffix}.jpg`,
    talk: `/photos/${id}-talk${suffix}.jpg`,
    laugh: `/photos/${id}-laugh${suffix}.jpg`,
    avatar: `/photos/${id}-avatar${suffix}.jpg`,
    cam: `/photos/${id}-cam${suffix}.jpg`,
  };
}

export const hosts: Host[] = [
  {
    id: "james",
    name: "James Christopher",
    firstName: "James",
    role: "Host & moderator",
    lens: "brand",
    lensLabel: "Brand lens",
    linkedin: "https://www.linkedin.com/in/jchrisa/",
    hook: "Who checks the bot?",
    bio: "James is one of the few marketing leaders in the world who holds patents in machine learning and advanced sensor technology. With more than 20 years as a marketing executive, user experience expert and brand leader, he has applied his technical insights across IoT, health and wellness, and consumer electronics. He currently advises startups on AI transformation and is an advocate of human-in-the-loop systems and IRL experiences.",
    asksFirst: "Who's the human in this loop, and can they say no?",
    photos: photos("james", "-real", { card: true }),
  },
  {
    id: "greg",
    name: "Greg Fisher",
    firstName: "Greg",
    role: "Co-host",
    lens: "money",
    lensLabel: "AI and finance lens",
    linkedin: "https://www.linkedin.com/in/gregoryafisher/",
    hook: "Who's paying for all these pilots?",
    bio: "Greg has run finance for about 20 years at companies in healthcare, biotech, manufacturing, consumer electronics and professional services, including overseas postings at multinationals. As a transformation consultant, he raises margins and builds the reporting and data systems a company can scale on. He previously lectured at UC San Diego's Rady School of Management.",
    asksFirst: "Which line on the P&L moves, and when?",
    photos: photos("greg"),
  },
  {
    id: "bryce",
    name: "Bryce Gilleland",
    firstName: "Bryce",
    role: "Co-host",
    lens: "venture",
    lensLabel: "Venture lens",
    linkedin: "https://www.linkedin.com/in/bryce-gilleland-574b74a/",
    hook: "Is your moat a prompt?",
    bio: "Bryce has spent more than 20 years running teams and funding founders across energy, policy, blockchain and finance, as a CEO, investor and advisor. As Co-GP of the Cal Innovation Fund, he works with founders taking new tech to market. He runs the fund's operations on AI agents he designed himself. He moved early on blockchain and holds an MBA from Berkeley Haas.",
    asksFirst: "If this works, who keeps the money?",
    photos: photos("bryce", "-real"),
  },
];

// Lens label for use mid-sentence ("Co-host, brand lens"). Lowercases the
// first letter unless the first word is an acronym, so "AI and finance lens" keeps its caps.
export function lensPhrase(label: string) {
  const first = label.split(" ")[0];
  return first.length > 1 && first === first.toUpperCase() ? label : label.charAt(0).toLowerCase() + label.slice(1);
}

export const hostById = Object.fromEntries(hosts.map((h) => [h.id, h])) as Record<HostId, Host>;
