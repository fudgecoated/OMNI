import { useHermesStore } from "../../stores/hermesStore";
import { useContacts } from "../../hooks/useContacts";
import { SECTION_CONFIG } from "../../lib/sectionConfig";

export function FollowupsWorkspace() {
  const config = SECTION_CONFIG.followups;
  const selectedTargets = useHermesStore((s) => s.selectedTargets);
  const setSidebarSection = useHermesStore((s) => s.setSidebarSection);
  const { due, contacts } = useContacts();

  return (
    <div className="vl-tile flex flex-col h-full overflow-hidden">
      <header className="hermes-panel-header">
        <h1 className="hermes-panel-header__title">{config.centerTitle}</h1>
        <p className="hermes-panel-header__subtitle">{config.centerSubtitle}</p>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
        <div className="hermes-understanding">
          <p className="hermes-understanding__title">
            {due.length > 0
              ? `${due.length} follow-up${due.length === 1 ? "" : "s"} due`
              : "No follow-ups due right now"}
          </p>
          <p className="hermes-understanding__text">
            Log outreach in the <strong>Follow-ups</strong> tab on the right after you send a
            message. Hermes will remind you when it&apos;s time for a polite check-in.
          </p>
        </div>

        {selectedTargets.length > 0 && (
          <p className="text-sm" style={{ marginTop: "1rem" }}>
            {selectedTargets.length} contact
            {selectedTargets.length === 1 ? "" : "s"} selected from your active pin — log them on
            the right.
          </p>
        )}

        {contacts.length > 0 && (
          <>
            <div className="vl-menu__section-label" style={{ marginTop: "1rem" }}>
              <span>Recent outreach</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.8125rem" }}>
              {contacts.slice(0, 5).map((c) => (
                <li key={c.id}>
                  {c.personName} · {c.company}
                </li>
              ))}
            </ul>
          </>
        )}

        <button
          type="button"
          className="vl-btn vl-btn--primary"
          style={{ marginTop: "1.25rem" }}
          onClick={() => setSidebarSection("chat")}
        >
          Draft follow-up in Outreach Chat →
        </button>
      </div>
    </div>
  );
}
