import type { OutreachTarget } from "@hermes/shared";
import { FinderContactRow } from "../finder/FinderContactRow";
import { useHermesStore } from "../../stores/hermesStore";
import { useSessionStore } from "../../stores/sessionStore";

export function PersonResult({ variant = "chat" }: { variant?: "chat" | "finder" }) {
  const selectedTargets = useHermesStore((s) => s.selectedTargets);
  const toggleTarget = useHermesStore((s) => s.toggleTarget);
  const setSidebarSection = useHermesStore((s) => s.setSidebarSection);
  const setResultsTab = useHermesStore((s) => s.setResultsTab);
  const activeSession = useSessionStore((s) =>
    s.sessions.find((sess) => sess.id === s.activeId)
  );

  const allPeople = variant === "finder" ? (activeSession?.results ?? []) : [];
  const selectedIds = new Set(selectedTargets.map((t) => t.id));

  if (variant === "finder" && allPeople.length === 0) {
    return (
      <div className="hermes-result-block">
        <h3 style={{ margin: "0 0 0.5rem" }}>Contacts</h3>
        <p style={{ color: "var(--vl-muted)", fontSize: "0.875rem" }}>
          Use + New search in the sidebar, then Find people in the center.
        </p>
      </div>
    );
  }

  if (variant !== "finder" && selectedTargets.length === 0) {
    return (
      <div className="hermes-result-block">
        <h3 style={{ margin: "0 0 0.5rem" }}>Contacts</h3>
        <p style={{ color: "var(--vl-muted)", fontSize: "0.875rem" }}>
          No contacts selected. Open{" "}
          <button
            type="button"
            className="hermes-inline-link"
            onClick={() => setSidebarSection("finder")}
          >
            People Finder
          </button>{" "}
          to search and select people.
        </p>
      </div>
    );
  }

  const openOutreach = () => {
    setSidebarSection("chat");
    setResultsTab("message");
  };

  const draftFor = (person: OutreachTarget) => {
    if (!selectedIds.has(person.id)) {
      toggleTarget(person);
    }
    openOutreach();
  };

  if (variant === "finder") {
    return (
      <div className="hermes-finder-selected-panel">
        <div className="hermes-finder-selected-panel__head">
          <div>
            <p className="hermes-results-eyebrow">Ranked contacts</p>
            <h3 className="hermes-finder-selected-panel__title">
              Curated recommendations
            </h3>
          </div>
          {selectedTargets.length > 0 && (
            <div className="hermes-finder-selected-panel__actions">
              <button type="button" className="vl-btn vl-btn--primary" onClick={openOutreach}>
                Draft outreach
              </button>
            </div>
          )}
        </div>

        <p className="hermes-finder-selected-panel__hint">
          {allPeople.length} ranked people - {selectedTargets.length} selected for outreach
        </p>

        <div className="hermes-finder-selected-panel__list">
          {allPeople.map((person) => (
            <FinderContactRow
              key={person.id}
              person={person}
              selected={selectedIds.has(person.id)}
              onToggle={() => toggleTarget(person)}
              onDraft={() => draftFor(person)}
            />
          ))}
        </div>

        {activeSession?.searchSource && (
          <p className="hermes-finder-selected-panel__meta">
            Source: {activeSession.searchSource === "claude_ai" ? "AI + web" : "seed data"}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="hermes-result-block">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
        <h3 style={{ margin: "0 0 0.75rem" }}>Contacts ({selectedTargets.length})</h3>
      </div>
      <ul className="hermes-target-list">
        {selectedTargets.map((person) => (
          <ContactDetailCard key={person.id} person={person} onRemove={() => toggleTarget(person)} />
        ))}
      </ul>
    </div>
  );
}

function ContactDetailCard({
  person,
  onRemove,
}: {
  person: OutreachTarget;
  onRemove: () => void;
}) {
  return (
    <li className="hermes-target-card">
      <div className="hermes-target-card__header">
        <strong>{person.name}</strong>
        <button
          type="button"
          className="vl-chip"
          style={{ fontSize: "0.7rem", padding: "2px 8px" }}
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
      <p style={{ color: "var(--vl-muted)", fontSize: "0.875rem", margin: "0.25rem 0" }}>
        {person.role} - {person.team}
      </p>
      <dl style={{ fontSize: "0.8125rem", margin: 0 }}>
        <dt style={{ fontWeight: 600, marginTop: "0.5rem" }}>Company</dt>
        <dd style={{ margin: "0.15rem 0 0" }}>{person.company}</dd>
        {person.schoolConnection && (
          <>
            <dt style={{ fontWeight: 600, marginTop: "0.5rem" }}>School tie</dt>
            <dd style={{ margin: "0.15rem 0 0", color: "var(--ws-sage)" }}>
              {person.schoolConnection}
            </dd>
          </>
        )}
        {person.relevanceScore != null && (
          <>
            <dt style={{ fontWeight: 600, marginTop: "0.5rem" }}>Relevance</dt>
            <dd style={{ margin: "0.15rem 0 0" }}>{person.relevanceScore} / 100</dd>
          </>
        )}
        <dt style={{ fontWeight: 600, marginTop: "0.5rem" }}>LinkedIn</dt>
        <dd style={{ margin: "0.15rem 0 0", wordBreak: "break-all" }}>
          <a href={person.linkedinUrl} target="_blank" rel="noreferrer">
            {person.linkedinUrl}
          </a>
        </dd>
      </dl>
    </li>
  );
}
