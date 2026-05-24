import { SessionList } from "../session/SessionList";

/** Left sidebar: pinned searches only. Search form lives in the center panel. */
export function FinderPanel() {
  return (
    <div className="hermes-finder-panel">
      <SessionList variant="finder" />
    </div>
  );
}
