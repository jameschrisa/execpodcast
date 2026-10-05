import type { HostId } from "./hosts";

// Draft takes written to each host's stated lens. Each host should approve or
// rewrite his four before launch.
export type LensQuestion = {
  id: string;
  question: string;
  takes: Record<HostId, string>;
};

export const lensQuestions: LensQuestion[] = [
  {
    id: "replace-hire",
    question: "Should we replace a hire with an AI agent?",
    takes: {
      james:
        "Name the person who reviews the agent's work before a customer sees it. If you can't name them, you're hiring a liability.",
      greg: "Price the agent with the hours someone spends checking its work. Compare that number to the salary, then decide.",
      bryce:
        "I run my fund's operations on agents I designed. Start with a workflow you can write down step by step. If you can't write it down, the agent can't run it.",
    },
  },
  {
    id: "rebrand-ai",
    question: "Should we rebrand as an AI company?",
    takes: {
      james:
        "Put AI in the name when customers can feel it in the product. Until then, the label makes a promise your support team has to keep.",
      greg: "Show me the revenue line that changes. If pricing and margin stay flat after the rebrand, you paid for a new logo.",
      bryce:
        "Investors have priced in the AI label. Rebrand around the problem you own, so you still stand out when your competitors say AI too.",
    },
  },
  {
    id: "scale-pilot",
    question: "Our AI pilot worked. Do we scale it?",
    takes: {
      james:
        "Find out who checked the outputs during the pilot. If your best operator caught the misses, build a review gate before you scale. That operator won't scale with it.",
      greg: "Rebuild the business case at production pricing and real volume. Pilot math runs on discounts and goodwill, and neither lasts into year two.",
      bryce:
        "Scale it if the pilot taught you something a competitor can't copy next quarter. If a vendor could sell them the same result, put the money somewhere else.",
    },
  },
  {
    id: "board",
    question: "What do I tell the board about AI?",
    takes: {
      james:
        "Tell them where a person stays in the loop and who owns the call when the model gets it wrong. Directors want to see the controls before the demo.",
      greg: "Bring one page: what you spent on AI this year and what moved on the P&L. If the second column is empty, say so before they ask.",
      bryce:
        "Show them the rival that AI makes dangerous and where you'll stand in three years. Boards can't back a tool list.",
    },
  },
];
