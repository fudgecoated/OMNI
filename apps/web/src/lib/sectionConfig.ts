import type { ResultsTab, SidebarSection } from "../stores/hermesStore";

export interface SectionTab {
  id: ResultsTab;
  label: string;
}

export interface SectionConfig {
  id: SidebarSection;
  navLabel: string;
  workspaceTitle: string;
  workspaceRegion: string;
  workspaceBrief: (ctx: { searchTitle?: string; selectedCount: number }) => string;
  centerTitle: string;
  centerSubtitle: string;
  tabs: SectionTab[];
  defaultTab: ResultsTab;
  sidebarPanelTitle?: string;
  sidebarPanelDescription?: string;
}

export const SECTION_CONFIG: Record<SidebarSection, SectionConfig> = {
  profile: {
    id: "profile",
    navLabel: "My Profile",
    workspaceTitle: "My Profile",
    workspaceRegion: "Applicant story",
    workspaceBrief: () =>
      "Build your story once — Hermes reuses it in People Finder, outreach drafts, and follow-ups.",
    centerTitle: "Profile Coach",
    centerSubtitle:
      "Chat to add projects and skills. The Details form and Context markdown on the right update together.",
    tabs: [{ id: "profile", label: "Profile" }],
    defaultTab: "profile",
  },
  finder: {
    id: "finder",
    navLabel: "People Finder",
    workspaceTitle: "People Finder",
    workspaceRegion: "Company search",
    workspaceBrief: ({ searchTitle, selectedCount }) => {
      const pin = searchTitle ? `Pin: ${searchTitle}. ` : "";
      const sel =
        selectedCount > 0
          ? `${selectedCount} selected — review on the right or open Outreach Chat.`
          : "Pick contacts here; company research appears on the right.";
      return `${pin}${sel}`;
    },
    centerTitle: "People Finder",
    centerSubtitle:
      "Run a search for this pin, then pick contacts and chat about who to reach out to.",
    tabs: [
      { id: "company", label: "Company" },
      { id: "selected", label: "Selected" },
    ],
    defaultTab: "company",
    sidebarPanelTitle: "Pinned searches",
    sidebarPanelDescription:
      "Each pin saves company research, contacts, and its own outreach chat.",
  },
  chat: {
    id: "chat",
    navLabel: "Outreach Chat",
    workspaceTitle: "Outreach Chat",
    workspaceRegion: "Message drafting",
    workspaceBrief: ({ searchTitle, selectedCount }) => {
      if (!searchTitle) {
        return "Select a pin below. Drafts use your profile + company research from that search.";
      }
      if (selectedCount === 0) {
        return `${searchTitle} — select contacts in People Finder to personalize drafts.`;
      }
      return `${searchTitle} — ${selectedCount} contact${selectedCount === 1 ? "" : "s"} in this thread.`;
    },
    centerTitle: "Outreach Coach",
    centerSubtitle:
      "Draft LinkedIn or email copy. Messages use your profile context and this pin's company research.",
    tabs: [
      { id: "message", label: "Message" },
      { id: "person", label: "Contacts" },
    ],
    defaultTab: "message",
    sidebarPanelTitle: "Conversation pins",
    sidebarPanelDescription:
      "Switch pins to change company, contacts, and chat history. Same pin as in People Finder.",
  },
  followups: {
    id: "followups",
    navLabel: "Follow-ups",
    workspaceTitle: "Follow-ups",
    workspaceRegion: "Outreach tracking",
    workspaceBrief: ({ selectedCount }) =>
      selectedCount > 0
        ? "Update status on the right · Pipeline tab for your full job-hunt board."
        : "Track outreach and pipeline phases on the right after you contact people.",
    centerTitle: "Follow-up planner",
    centerSubtitle:
      "List tab: log sends and due dates. Pipeline tab: move contacts through interview phases.",
    tabs: [{ id: "followups", label: "Follow-ups" }],
    defaultTab: "followups",
    sidebarPanelTitle: "Tracker",
    sidebarPanelDescription: "List + Pipeline views · status dropdowns on each contact.",
  },
};

export function tabsForSection(section: SidebarSection): SectionTab[] {
  return SECTION_CONFIG[section].tabs;
}

export function defaultTabForSection(section: SidebarSection): ResultsTab {
  return SECTION_CONFIG[section].defaultTab;
}

export function isTabAllowedInSection(tab: ResultsTab, section: SidebarSection): boolean {
  return SECTION_CONFIG[section].tabs.some((t) => t.id === tab);
}
