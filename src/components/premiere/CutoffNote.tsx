"use client";

import { useQuestionsOpen } from "@/lib/premiere";

// The Episode 1 question deadline, which turns into a pointer to the live chat
// (and Episode 2) once it passes so the page never shows a past date.
export function CutoffNote({ cutoffLabel }: { cutoffLabel: string }) {
  const open = useQuestionsOpen();
  if (open === false) return <>Episode 1 questions are closed. Bring yours to the live chat, or send one for Episode 2.</>;
  return <>Questions for Episode 1 close {cutoffLabel}.</>;
}
