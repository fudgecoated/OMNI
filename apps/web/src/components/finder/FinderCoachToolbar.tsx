import { useSessionStore } from "../../stores/sessionStore";
import { useHermesStore } from "../../stores/hermesStore";

/** Slim header above finder chat; new searches start from the left sidebar only. */
export function FinderCoachToolbar() {
  const activeSession = useSessionStore((s) =>
    s.sessions.find((sess) => sess.id === s.activeId)
  );
  const setResultsTab = useHermesStore((s) => s.setResultsTab);
  const selectedCount = useHermesStore((s) => s.selectedTargets.length);
  const peopleCount = activeSession?.results.length ?? 0;

  return (
    <header className="hermes-finder-coach-toolbar">
      <div className="hermes-finder-coach-toolbar__text">
        <h1 className="hermes-finder-coach-toolbar__title">Search coach</h1>
        <p className="hermes-finder-coach-toolbar__subtitle">
          <span className="session-pin-label">{activeSession?.searchTitle}</span>
          {" · "}
          {selectedCount} of {peopleCount} contacts selected
        </p>
      </div>
      {peopleCount > 0 && (
        <div className="hermes-finder-coach-toolbar__actions">
          <button
            type="button"
            className="vl-chip"
            onClick={() => setResultsTab("selected")}
          >
            View contacts
          </button>
        </div>
      )}
    </header>
  );
}
