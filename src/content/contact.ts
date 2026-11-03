export const contactTopics = [
  { id: "general", label: "General" },
  { id: "question", label: "Question for the show" },
  { id: "guest", label: "Guest pitch" },
  { id: "sponsorship", label: "Sponsorship or partnership" },
  { id: "press", label: "Press" },
  { id: "other", label: "Other" },
] as const;

export type ContactTopic = (typeof contactTopics)[number]["id"];

export const contactMessageMax = 2000;

export const contact = {
  title: "Contact the show",
  description: "Send Executive Upskill a message: a question, a guest pitch, a partnership idea or a press request.",
  intro: "Send the hosts a note. Pick a topic so it reaches the right person, and we reply by email.",
  privacy: "We use your email only to reply. We don't share it.",
  success: "Message sent. We read every one and reply by email.",
  successDetail: "If you want to pitch a guest or send a question for the live show, the forms on the home page are the fastest route.",
};
