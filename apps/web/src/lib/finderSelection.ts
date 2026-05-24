import type { OutreachTarget } from "@hermes/shared";
import { useHermesStore } from "../stores/hermesStore";
import { useSessionStore } from "../stores/sessionStore";

/** Select every contact from a search and show them on the Selected tab. */
export function applyFinderSelection(
  sessionId: string,
  people: OutreachTarget[],
  options?: { switchToSelectedTab?: boolean }
): void {
  useHermesStore.getState().setSelectedTargets(people);
  useSessionStore.getState().updateSession(sessionId, { selectedTargets: people });
  if (options?.switchToSelectedTab !== false) {
    useHermesStore.getState().setResultsTab("selected");
  }
}

export function clearFinderSelection(sessionId: string): void {
  useHermesStore.getState().setSelectedTargets([]);
  useSessionStore.getState().updateSession(sessionId, { selectedTargets: [] });
}
