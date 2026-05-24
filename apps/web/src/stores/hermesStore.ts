import { create } from "zustand";
import type {
  CompanySlug,
  GenerateMessageResponse,
  OutreachTarget,
  Person,
} from "@hermes/shared";
import { defaultTabForSection } from "../lib/sectionConfig";

function syncTargetsToActiveSession(targets: OutreachTarget[]): void {
  void import("./sessionStore").then(({ useSessionStore }) => {
    const activeId = useSessionStore.getState().activeId;
    if (!activeId) return;
    useSessionStore.getState().updateSession(activeId, { selectedTargets: targets });
  });
}

export type SidebarSection = "chat" | "finder" | "followups" | "profile";

export type ResultsTab =
  | "profile"
  | "message"
  | "person"
  | "followups"
  | "company"
  | "selected";

interface HermesState {
  sidebarSection: SidebarSection;
  resultsTab: ResultsTab;
  company: CompanySlug;
  finderCompany: string;
  finderLoading: boolean;
  /** Pin id while POST /api/finder/search is in flight (avoids stuck global loading). */
  finderLoadingSessionId: string | null;
  finderError: string | null;
  selectedPerson: Person | null;
  selectedTargets: OutreachTarget[];
  generatedMessage: GenerateMessageResponse | null;
  setSidebarSection: (s: SidebarSection) => void;
  setResultsTab: (t: ResultsTab) => void;
  setCompany: (c: CompanySlug) => void;
  setFinderCompany: (c: string) => void;
  setFinderLoading: (v: boolean) => void;
  setFinderLoadingSession: (id: string | null) => void;
  setFinderError: (e: string | null) => void;
  selectPerson: (p: Person | null) => void;
  toggleTarget: (t: OutreachTarget) => void;
  addTarget: (t: OutreachTarget) => void;
  setSelectedTargets: (targets: OutreachTarget[]) => void;
  clearSelectedTargets: () => void;
  setGeneratedMessage: (m: GenerateMessageResponse | null) => void;
}

export const useHermesStore = create<HermesState>((set, get) => ({
  sidebarSection: "finder",
  resultsTab: "company",
  company: "google",
  finderCompany: "",
  finderLoading: false,
  finderLoadingSessionId: null,
  finderError: null,
  selectedPerson: null,
  selectedTargets: [],
  generatedMessage: null,
  setSidebarSection: (sidebarSection) =>
    set({ sidebarSection, resultsTab: defaultTabForSection(sidebarSection) }),
  setResultsTab: (resultsTab) => set({ resultsTab }),
  setCompany: (company) => set({ company }),
  setFinderCompany: (finderCompany) => set({ finderCompany }),
  setFinderLoading: (finderLoading) => set({ finderLoading }),
  setFinderLoadingSession: (finderLoadingSessionId) =>
    set({ finderLoadingSessionId, finderLoading: finderLoadingSessionId != null }),
  setFinderError: (finderError) => set({ finderError }),
  selectPerson: (selectedPerson) => {
    const { sidebarSection } = get();
    const tab =
      sidebarSection === "finder"
        ? "selected"
        : sidebarSection === "chat"
          ? "person"
          : get().resultsTab;
    set({
      selectedPerson,
      ...(sidebarSection === "finder" || sidebarSection === "chat"
        ? { resultsTab: selectedPerson ? tab : defaultTabForSection(sidebarSection) }
        : {}),
    });
  },
  toggleTarget: (target) => {
    const { selectedTargets, sidebarSection } = get();
    const exists = selectedTargets.some((t) => t.id === target.id);
    const next = exists
      ? selectedTargets.filter((t) => t.id !== target.id)
      : [...selectedTargets, target];
    const tab =
      sidebarSection === "finder"
        ? next.length
          ? "selected"
          : "company"
        : sidebarSection === "chat"
          ? next.length
            ? "person"
            : "message"
          : get().resultsTab;
    set({
      selectedTargets: next,
      ...(sidebarSection === "finder" || sidebarSection === "chat" ? { resultsTab: tab } : {}),
    });
    syncTargetsToActiveSession(next);
  },
  addTarget: (target) => {
    const { selectedTargets, sidebarSection } = get();
    if (selectedTargets.some((t) => t.id === target.id)) return;
    const next = [...selectedTargets, target];
    const tab = sidebarSection === "finder" ? "selected" : sidebarSection === "chat" ? "person" : get().resultsTab;
    set({
      selectedTargets: next,
      ...(sidebarSection === "finder" || sidebarSection === "chat" ? { resultsTab: tab } : {}),
    });
    syncTargetsToActiveSession(next);
  },
  setSelectedTargets: (selectedTargets) => {
    const { sidebarSection } = get();
    const tab =
      sidebarSection === "finder"
        ? selectedTargets.length
          ? "selected"
          : "company"
        : sidebarSection === "chat"
          ? selectedTargets.length
            ? "person"
            : "message"
          : get().resultsTab;
    set({
      selectedTargets,
      ...(sidebarSection === "finder" || sidebarSection === "chat" ? { resultsTab: tab } : {}),
    });
    syncTargetsToActiveSession(selectedTargets);
  },
  clearSelectedTargets: () => {
    set({ selectedTargets: [], selectedPerson: null });
    syncTargetsToActiveSession([]);
  },
  setGeneratedMessage: (generatedMessage) => {
    const { sidebarSection } = get();
    set({
      generatedMessage,
      ...(sidebarSection === "chat" ? { resultsTab: "message" } : {}),
    });
  },
}));
