import { create } from "zustand";
import type {
  CompanySlug,
  GenerateMessageResponse,
  Person,
  StudentProfile,
} from "@hermes/shared";
import { DEFAULT_STUDENT } from "../constants";

export type SidebarSection = "chat" | "finder" | "followups";

export type ResultsTab = "message" | "person" | "followups";

interface HermesState {
  sidebarSection: SidebarSection;
  resultsTab: ResultsTab;
  company: CompanySlug;
  selectedPerson: Person | null;
  student: StudentProfile;
  generatedMessage: GenerateMessageResponse | null;
  setSidebarSection: (s: SidebarSection) => void;
  setResultsTab: (t: ResultsTab) => void;
  setCompany: (c: CompanySlug) => void;
  selectPerson: (p: Person | null) => void;
  setStudent: (s: StudentProfile) => void;
  setGeneratedMessage: (m: GenerateMessageResponse | null) => void;
}

export const useHermesStore = create<HermesState>((set) => ({
  sidebarSection: "chat",
  resultsTab: "person",
  company: "google",
  selectedPerson: null,
  student: DEFAULT_STUDENT,
  generatedMessage: null,
  setSidebarSection: (sidebarSection) => set({ sidebarSection }),
  setResultsTab: (resultsTab) => set({ resultsTab }),
  setCompany: (company) => set({ company }),
  selectPerson: (selectedPerson) =>
    set({
      selectedPerson,
      resultsTab: selectedPerson ? "person" : "message",
    }),
  setStudent: (student) => set({ student }),
  setGeneratedMessage: (generatedMessage) =>
    set({ generatedMessage, resultsTab: "message" }),
}));
