import { SessionList } from "../session/SessionList";

/**
 * Left sidebar for People Finder: pinned searches and the only **+ New search** control.
 * Search form and coach chat live in FinderWorkspace (center column).
 */
export function FinderPanel() {
  return (
    <div className="hermes-finder-panel">
      <SessionList variant="finder" />
    </div>
  );
}
