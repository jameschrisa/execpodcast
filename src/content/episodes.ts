import type { HostId, LensId } from "./hosts";

export type Episode = {
  number: number;
  title: string;
  lens: LensId | "all";
};

// Season 1 plan. Titles are working titles; air dates follow once the cadence is set.
export const episodes: Episode[] = [
  { number: 1, title: "Your 2027 AI Budget, Argued Three Ways", lens: "all" },
  { number: 2, title: "Who Checks the Bot? Designing Human Review Into AI", lens: "brand" },
  { number: 3, title: "Running a Venture Fund on AI Agents", lens: "venture" },
  { number: 4, title: "The AI Pilot Bill Comes Due", lens: "money" },
  { number: 5, title: "Your Chatbot Is Your Brand Now", lens: "brand" },
  { number: 6, title: "Is Your Moat a Prompt?", lens: "venture" },
  { number: 7, title: "Automating Month-End Close Without Losing Control", lens: "money" },
  { number: 8, title: "Hire a Person or Deploy an Agent?", lens: "all" },
  { number: 9, title: "Selling AI to Customers Who Don't Trust It", lens: "brand" },
  { number: 10, title: "What Survived the Blockchain Hype", lens: "venture" },
  { number: 11, title: "Reporting Your Board Will Believe", lens: "money" },
  { number: 12, title: "Pop Culture as Due Diligence", lens: "all" },
];

export const episodeByNumber = Object.fromEntries(episodes.map((e) => [e.number, e])) as Record<number, Episode>;

export type Lens = {
  id: LensId;
  host: HostId;
  label: string;
  title: string;
  art: string;
  artAlt: string;
  episodes: number[];
};

export const lenses: Lens[] = [
  {
    id: "brand",
    host: "james",
    label: "Brand lens",
    title: "Brand meets the bot",
    art: "/art/megaphone.svg",
    artAlt: "Linocut print of a bullhorn",
    episodes: [2, 5, 9],
  },
  {
    id: "money",
    host: "greg",
    label: "AI and finance lens",
    title: "Make the AI pay",
    art: "/art/adding-machine.svg",
    artAlt: "Linocut print of a mechanical adding machine",
    episodes: [4, 7, 11],
  },
  {
    id: "venture",
    host: "bryce",
    label: "Venture lens",
    title: "Bet before consensus",
    art: "/art/knight.svg",
    artAlt: "Linocut print of a chess knight",
    episodes: [3, 6, 10],
  },
];

export const upNext = [1, 2, 3, 4];

export function episodeTag(n: number) {
  return `EP ${String(n).padStart(2, "0")}`;
}
