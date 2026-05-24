/**
 * People Finder search hook: POST /api/finder/search, update active pin, auto-select all contacts.
 *
 * Loading is tracked per pin via hermesStore.finderLoadingSessionId.
 * New searches are started from the sidebar (+ New search), not from this hook directly.
 */
import { useCallback } from "react";
import type { FinderSearchResponse } from "@hermes/shared";
import { apiFetch } from "../lib/api";
import { queryKey, searchTitle, toSessionQuery } from "../lib/searchTitle";
import { applyFinderSelection, clearFinderSelection } from "../lib/finderSelection";
import { useHermesStore } from "../stores/hermesStore";
import { getStudentProfile } from "../stores/profileStore";
import { useSessionStore } from "../stores/sessionStore";

const FINDER_SEARCH_TIMEOUT_MS = 180_000;

export function useFinder() {
  const setFinderLoadingSession = useHermesStore((s) => s.setFinderLoadingSession);
  const finderLoadingSessionId = useHermesStore((s) => s.finderLoadingSessionId);
  const setFinderError = useHermesStore((s) => s.setFinderError);
  const activeId = useSessionStore((s) => s.activeId);
  const activeSession = useSessionStore((s) =>
    s.sessions.find((sess) => sess.id === s.activeId)
  );
  const updateSession = useSessionStore((s) => s.updateSession);
  const createSession = useSessionStore((s) => s.createSession);
  const selectSession = useSessionStore((s) => s.selectSession);

  const resetSearch = useCallback(() => {
    if (!activeId) return;
    setFinderError(null);
    clearFinderSelection(activeId);
    updateSession(activeId, {
      searchedAt: undefined,
      results: [],
      searchSource: undefined,
      outreachContext: undefined,
      finderMessages: [],
    });
    useHermesStore.getState().setResultsTab("company");
  }, [activeId, setFinderError, updateSession]);

  const search = useCallback(
    async (company: string, role?: string, city?: string, school?: string) => {
      const trimmed = company.trim();
      if (!trimmed) {
        setFinderError("Enter a company name");
        return;
      }

      const query = toSessionQuery({ company: trimmed, role, city, school });
      const key = queryKey(query);

      const existingWithResults = useSessionStore
        .getState()
        .sessions.find(
          (s) => s.query.company && queryKey(s.query) === key && s.results.length > 0
        );

      if (existingWithResults && existingWithResults.id !== useSessionStore.getState().activeId) {
        selectSession(existingWithResults.id);
        setFinderError(null);
        if (existingWithResults.selectedTargets.length === 0) {
          applyFinderSelection(existingWithResults.id, existingWithResults.results);
        } else {
          useHermesStore.getState().setResultsTab("selected");
        }
        return;
      }

      let sessionId = useSessionStore.getState().activeId;
      if (!sessionId) sessionId = createSession();

      setFinderLoadingSession(sessionId);
      setFinderError(null);

      updateSession(sessionId, { query, searchTitle: searchTitle(query) });

      try {
        const student = getStudentProfile();
        const data = await apiFetch<FinderSearchResponse>("/api/finder/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: trimmed,
            role: role || undefined,
            city: city || undefined,
            school: school || undefined,
            student,
          }),
          timeoutMs: FINDER_SEARCH_TIMEOUT_MS,
        });

        updateSession(sessionId, {
          query,
          searchTitle: searchTitle(query),
          results: data.people,
          searchSource: data.source,
          outreachContext: data.context,
          searchedAt: Date.now(),
          finderMessages: [],
        });

        if (data.people.length > 0) {
          applyFinderSelection(sessionId, data.people);
        } else {
          clearFinderSelection(sessionId);
        }

        if (data.count === 0) {
          setFinderError("No contacts found. Try a broader role or different spelling.");
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "Search failed";
        setFinderError(message);
        updateSession(sessionId, {
          query,
          searchTitle: searchTitle(query),
          results: [],
          searchedAt: undefined,
          outreachContext: undefined,
        });
      } finally {
        setFinderLoadingSession(null);
      }
    },
    [createSession, selectSession, setFinderError, setFinderLoadingSession, updateSession]
  );

  const people = activeSession?.results ?? [];
  const loading = Boolean(activeId && finderLoadingSessionId === activeId);
  const error = useHermesStore((s) => s.finderError);
  const searchedAt = activeSession?.searchedAt;
  const hasResults = people.length > 0;

  return {
    people,
    loading,
    error,
    search,
    resetSearch,
    searchedAt,
    hasResults,
    activeSession,
    activeId,
  };
}
