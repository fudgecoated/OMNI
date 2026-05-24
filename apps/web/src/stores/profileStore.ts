import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApplicantProject, StudentProfile } from "@hermes/shared";
import { buildProfileMarkdown, normalizeStudentProfile, profileCompleteness } from "@hermes/shared";
import { DEFAULT_STUDENT } from "../constants";

export interface ProfileSourceFile {
  id: string;
  name: string;
  text: string;
  addedAt: number;
}

export interface ProfileSources {
  links: string[];
  files: ProfileSourceFile[];
}

function activeProfile(state: {
  profile: StudentProfile;
  draftProfile: StudentProfile | null;
  isEditing: boolean;
}): StudentProfile {
  return state.isEditing && state.draftProfile ? state.draftProfile : state.profile;
}

interface ProfileState {
  profile: StudentProfile;
  draftProfile: StudentProfile | null;
  isEditing: boolean;
  sources: ProfileSources;
  contextMarkdown: string;
  setProfile: (profile: StudentProfile) => void;
  startEditing: () => void;
  cancelEditing: () => void;
  saveEditing: () => void;
  patchDraft: (patch: Partial<StudentProfile>) => void;
  applyProfilePatch: (patch: Partial<StudentProfile>) => void;
  setContextMarkdown: (md: string) => void;
  setSourceLinks: (links: string[]) => void;
  addSourceFile: (file: Omit<ProfileSourceFile, "id" | "addedAt">) => void;
  removeSourceFile: (id: string) => void;
  addProject: () => void;
  updateProject: (index: number, project: ApplicantProject) => void;
  removeProject: (index: number) => void;
  completeness: () => ReturnType<typeof profileCompleteness>;
  getContextMarkdown: () => string;
}

const emptySources = (): ProfileSources => ({ links: [], files: [] });

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_STUDENT,
      draftProfile: null,
      isEditing: false,
      sources: emptySources(),
      contextMarkdown: buildProfileMarkdown(DEFAULT_STUDENT),

      setProfile: (profile) => {
        const normalized = normalizeStudentProfile(profile);
        set({
          profile: normalized,
          draftProfile: null,
          isEditing: false,
          contextMarkdown: buildProfileMarkdown(normalized),
        });
      },

      startEditing: () => {
        const profile = get().profile;
        const draftProfile = normalizeStudentProfile({
          ...profile,
          projects: [...profile.projects],
        });
        set({
          isEditing: true,
          draftProfile,
          contextMarkdown: buildProfileMarkdown(draftProfile),
        });
      },

      cancelEditing: () => {
        const profile = get().profile;
        set({
          isEditing: false,
          draftProfile: null,
          contextMarkdown: buildProfileMarkdown(profile),
        });
      },

      saveEditing: () => {
        const draft = get().draftProfile;
        if (!draft) return;
        const normalized = normalizeStudentProfile(draft);
        set({
          profile: normalized,
          isEditing: false,
          draftProfile: null,
          contextMarkdown: buildProfileMarkdown(normalized),
        });
      },

      patchDraft: (patch) =>
        set((state) => {
          if (!state.draftProfile) return state;
          const draftProfile = normalizeStudentProfile({ ...state.draftProfile, ...patch });
          return { draftProfile, contextMarkdown: buildProfileMarkdown(draftProfile) };
        }),

      applyProfilePatch: (patch) =>
        set((state) => {
          const base = activeProfile(state);
          const next = normalizeStudentProfile({ ...base, ...patch });
          if (state.isEditing) {
            return { draftProfile: next, contextMarkdown: buildProfileMarkdown(next) };
          }
          return { profile: next, contextMarkdown: buildProfileMarkdown(next) };
        }),

      setContextMarkdown: (contextMarkdown) => set({ contextMarkdown }),

      setSourceLinks: (links) =>
        set((state) => ({
          sources: { ...state.sources, links },
        })),

      addSourceFile: (file) =>
        set((state) => ({
          sources: {
            ...state.sources,
            files: [
              ...state.sources.files,
              { ...file, id: crypto.randomUUID(), addedAt: Date.now() },
            ],
          },
        })),

      removeSourceFile: (id) =>
        set((state) => ({
          sources: {
            ...state.sources,
            files: state.sources.files.filter((f) => f.id !== id),
          },
        })),

      addProject: () => {
        const patch = (p: StudentProfile) =>
          normalizeStudentProfile({
            ...p,
            projects: [...p.projects, { name: "", description: "", tech: [] }],
          });
        set((state) => {
          if (state.isEditing && state.draftProfile) {
            const draftProfile = patch(state.draftProfile);
            return { draftProfile, contextMarkdown: buildProfileMarkdown(draftProfile) };
          }
          const profile = patch(state.profile);
          return { profile, contextMarkdown: buildProfileMarkdown(profile) };
        });
      },

      updateProject: (index, project) => {
        const patch = (p: StudentProfile) => {
          const projects = [...p.projects];
          projects[index] = project;
          return normalizeStudentProfile({ ...p, projects });
        };
        set((state) => {
          if (state.isEditing && state.draftProfile) {
            const draftProfile = patch(state.draftProfile);
            return { draftProfile, contextMarkdown: buildProfileMarkdown(draftProfile) };
          }
          const profile = patch(state.profile);
          return { profile, contextMarkdown: buildProfileMarkdown(profile) };
        });
      },

      removeProject: (index) => {
        const patch = (p: StudentProfile) =>
          normalizeStudentProfile({
            ...p,
            projects: p.projects.filter((_, i) => i !== index),
          });
        set((state) => {
          if (state.isEditing && state.draftProfile) {
            const draftProfile = patch(state.draftProfile);
            return { draftProfile, contextMarkdown: buildProfileMarkdown(draftProfile) };
          }
          const profile = patch(state.profile);
          return { profile, contextMarkdown: buildProfileMarkdown(profile) };
        });
      },

      completeness: () => profileCompleteness(get().profile),

      getContextMarkdown: () => buildProfileMarkdown(activeProfile(get())),
    }),
    {
      name: "hermes-applicant-profile-v1",
      partialize: (state) => ({
        profile: state.profile,
        sources: state.sources,
        contextMarkdown: state.contextMarkdown,
      }),
      merge: (persisted, current) => {
        const p = persisted as ProfileState;
        const profile = normalizeStudentProfile({ ...DEFAULT_STUDENT, ...p?.profile });
        return {
          ...current,
          profile,
          sources: p?.sources ?? emptySources(),
          contextMarkdown: buildProfileMarkdown(profile),
        };
      },
    }
  )
);

export function getStudentProfile(): StudentProfile {
  return useProfileStore.getState().profile;
}

export function useLiveContextMarkdown(): string {
  return useProfileStore((s) => buildProfileMarkdown(activeProfile(s)));
}
