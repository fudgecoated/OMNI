/**
 * Persisted "pins" — one HermesSession per company search / outreach thread.
 *
 * Each pin holds finder results, outreachContext from the server, selected contacts,
 * and two message arrays: `messages` (outreach) vs `finderMessages` (people finder coach).
 * This preserves the behavioral loop judges see in the demo: research, choose contacts,
 * draft, then return later without losing the company-specific context.
 *
 * @see docs/FRONTEND.md
 * @see docs/FINDER.md
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UIMessage } from "ai";
import type { OutreachContext, OutreachTarget } from "@hermes/shared";
import { conversationTitle } from "../lib/conversationTitle";
import { queryKey, searchTitle, type SessionQuery } from "../lib/searchTitle";
import { useHermesStore } from "./hermesStore";

export interface HermesSession {
  id: string;
  searchTitle: string;
  chatTitle: string;
  query: SessionQuery;
  results: OutreachTarget[];
  selectedTargets: OutreachTarget[];
  messages: UIMessage[];
  /** People Finder coach thread (separate from Outreach Chat on the same pin). */
  finderMessages: UIMessage[];
  searchSource?: "hermes_seed_data" | "claude_ai";
  outreachContext?: OutreachContext;
  /** Set when Find people completes on this pin (success or empty). */
  searchedAt?: number;
  createdAt: number;
  updatedAt: number;
}

const LEGACY_CONVERSATIONS_KEY = "hermes-conversations-v1";
const STORAGE_KEY = "hermes-sessions-v1";

function newSession(partial?: Partial<HermesSession>): HermesSession {
  const now = Date.now();
  const query: SessionQuery = partial?.query ?? { company: "" };
  return {
    id: crypto.randomUUID(),
    searchTitle: partial?.searchTitle ?? "New search",
    chatTitle: partial?.chatTitle ?? "New chat",
    query,
    results: partial?.results ?? [],
    selectedTargets: partial?.selectedTargets ?? [],
    messages: partial?.messages ?? [],
    finderMessages: partial?.finderMessages ?? [],
    searchSource: partial?.searchSource,
    outreachContext: partial?.outreachContext,
    createdAt: partial?.createdAt ?? now,
    updatedAt: partial?.updatedAt ?? now,
  };
}

function syncHermesFromSession(session: HermesSession): void {
  useHermesStore.getState().setFinderCompany(session.query.company);

  let targets = session.selectedTargets;
  if (session.results.length > 0 && targets.length === 0) {
    targets = session.results;
    useSessionStore.getState().updateSession(session.id, { selectedTargets: targets });
  }
  useHermesStore.getState().setSelectedTargets(targets);

  if (session.results.length > 0 && useHermesStore.getState().sidebarSection === "finder") {
    useHermesStore.getState().setResultsTab("selected");
  }

  useHermesStore.getState().setFinderError(null);
  useHermesStore.getState().setFinderLoadingSession(null);
}

interface SessionState {
  sessions: HermesSession[];
  activeId: string | null;
  ensureInitialized: () => void;
  createSession: () => string;
  selectSession: (id: string) => HermesSession | undefined;
  deleteSession: (id: string) => void;
  updateSession: (
    id: string,
    patch: Partial<
      Pick<
        HermesSession,
        | "messages"
        | "finderMessages"
        | "chatTitle"
        | "searchTitle"
        | "query"
        | "results"
        | "selectedTargets"
        | "searchSource"
        | "outreachContext"
        | "searchedAt"
      >
    >
  ) => void;
  getActive: () => HermesSession | undefined;
  shouldReuseActiveForSearch: () => boolean;
}

function migrateLegacyConversations(): { sessions: HermesSession[]; activeId: string | null } | null {
  try {
    const raw = localStorage.getItem(LEGACY_CONVERSATIONS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      state?: { conversations?: Array<{
        id: string;
        title: string;
        messages: UIMessage[];
        selectedTargets: OutreachTarget[];
        createdAt: number;
        updatedAt: number;
      }>; activeId?: string | null };
    };
    const conversations = parsed.state?.conversations ?? [];
    if (conversations.length === 0) return null;

    const sessions: HermesSession[] = conversations.map((c) => ({
      id: c.id,
      searchTitle: c.title,
      chatTitle: c.title,
      query: { company: c.title === "New chat" ? "" : c.title },
      results: [],
      selectedTargets: c.selectedTargets,
      messages: c.messages,
      finderMessages: [],
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return { sessions, activeId: parsed.state?.activeId ?? sessions[0].id };
  } catch {
    return null;
  }
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeId: null,

      ensureInitialized: () => {
        const migrated = migrateLegacyConversations();
        if (migrated && get().sessions.length === 0) {
          set(migrated);
          localStorage.removeItem(LEGACY_CONVERSATIONS_KEY);
        }

        let { sessions, activeId } = get();
        if (sessions.some((s) => s.finderMessages === undefined)) {
          sessions = sessions.map((s) => ({
            ...s,
            finderMessages: s.finderMessages ?? [],
          }));
          set({ sessions });
        }

        if (sessions.length === 0) {
          const session = newSession();
          set({ sessions: [session], activeId: session.id });
          syncHermesFromSession(session);
          return;
        }
        if (!activeId || !sessions.some((s) => s.id === activeId)) {
          const first = sessions[0];
          set({ activeId: first.id });
          syncHermesFromSession(first);
        } else {
          const active = sessions.find((s) => s.id === activeId);
          if (active) syncHermesFromSession(active);
        }
      },

      createSession: () => {
        const session = newSession();
        set((state) => ({
          sessions: [session, ...state.sessions],
          activeId: session.id,
        }));
        syncHermesFromSession(session);
        return session.id;
      },

      selectSession: (id) => {
        const session = get().sessions.find((s) => s.id === id);
        if (session) {
          set({ activeId: id });
          syncHermesFromSession(session);
        }
        return session;
      },

      deleteSession: (id) => {
        set((state) => {
          const sessions = state.sessions.filter((s) => s.id !== id);
          let activeId = state.activeId;
          if (activeId === id) activeId = sessions[0]?.id ?? null;
          if (sessions.length === 0) {
            const session = newSession();
            syncHermesFromSession(session);
            return { sessions: [session], activeId: session.id };
          }
          const active = sessions.find((s) => s.id === activeId);
          if (active) syncHermesFromSession(active);
          return { sessions, activeId };
        });
      },

      updateSession: (id, patch) => {
        set((state) => ({
          sessions: state.sessions.map((s) => {
            if (s.id !== id) return s;
            const messages = patch.messages ?? s.messages;
            const chatTitle =
              patch.chatTitle ??
              (patch.messages ? conversationTitle(messages) : s.chatTitle);
            const query = patch.query ?? s.query;
            const searchTitleNext =
              patch.searchTitle ?? (patch.query ? searchTitle(query) : s.searchTitle);
            return {
              ...s,
              ...patch,
              messages,
              chatTitle,
              query,
              searchTitle: searchTitleNext,
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      getActive: () => {
        const { sessions, activeId } = get();
        return sessions.find((s) => s.id === activeId);
      },

      shouldReuseActiveForSearch: () => {
        const active = get().getActive();
        if (!active) return false;
        return (
          active.results.length === 0 &&
          active.messages.length === 0 &&
          !active.query.company.trim()
        );
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        sessions: state.sessions,
        activeId: state.activeId,
      }),
    }
  )
);
