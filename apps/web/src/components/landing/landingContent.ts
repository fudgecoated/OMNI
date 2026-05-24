export const landingNav = [
  { id: "how", label: "How it works" },
  { id: "features", label: "Features" },
  { id: "students", label: "For students" },
  { id: "faq", label: "FAQ" },
] as const;

export const pathSteps = [
  {
    icon: "/brand-icons/finder.png",
    title: "Read the room before you reach out",
    copy: "Start with a company brief that turns public signals into a sharper search.",
  },
  {
    icon: "/brand-icons/network.png",
    title: "Find people with a real reason to care",
    copy: "Prioritize recruiters, product leaders, alumni, and warm adjacency in one pass.",
  },
  {
    icon: "/brand-icons/draft.png",
    title: "Draft like you already did the homework",
    copy: "Use your profile, the company context, and the contact's role to write a note worth opening.",
  },
] as const;

export const productFeatures = [
  {
    icon: "/brand-icons/profile.png",
    accent: "blue" as const,
    title: "Profile coach",
    copy: "Turn your resume, projects, and links into structured context the rest of Weave can actually use.",
  },
  {
    icon: "/brand-icons/finder.png",
    accent: "purple" as const,
    title: "People finder",
    copy: "Search by company, role, and city. Rank contacts by relevance and evidence, not random LinkedIn noise.",
  },
  {
    icon: "/brand-icons/network.png",
    accent: "pink" as const,
    title: "Company research",
    copy: "Hiring signals, teams, stack, and a personalized playbook for how to apply and what to learn next.",
  },
  {
    icon: "/brand-icons/draft.png",
    accent: "yellow" as const,
    title: "Outreach drafts",
    copy: "Short subjects, readable paragraphs, and proof pulled from your real projects. You edit before you send.",
  },
  {
    icon: "/brand-icons/followups.png",
    accent: "green" as const,
    title: "Follow-up tracker",
    copy: "Pin contacts, log outreach, and see who is due for a bump so warm threads do not go cold.",
  },
  {
    icon: "/brand-icons/chat.png",
    accent: "cyan" as const,
    title: "Outreach coach",
    copy: "Ask for angles, rewrites, or interview prep with full company and profile context in the thread.",
  },
] as const;

export const studentBullets = [
  "Find people beyond your immediate circle at target companies—and see why each contact is worth a thoughtful note.",
  "No auto-send: you copy, personalize, and send on LinkedIn or email yourself.",
  "Skills you cannot claim stay out of drafts so outreach stays honest.",
] as const;

export const faqItems = [
  {
    question: "Is Weave an auto-sender or CRM?",
    answer:
      "Neither. Weave helps you research, draft, and track outreach. You always send messages yourself.",
  },
  {
    question: "Do I need API keys for the demo?",
    answer:
      "The demo runs with sample data and local storage. Live people search uses your Anthropic key when configured on the server.",
  },
  {
    question: "Who is this for?",
    answer:
      "Students who know cold applications feel hopeless but still want thoughtful, specific conversations with people at target companies.",
  },
] as const;
