import { useState } from "react";
import type { ContactStatus } from "@hermes/shared";
import { useHermesStore } from "../../stores/hermesStore";
import { useContacts } from "../../hooks/useContacts";
import { ContactTrackerCard } from "./ContactTrackerCard";
import { PipelineKanban } from "./PipelineKanban";

type FollowupsView = "tracker" | "pipeline";

export function FollowupsPanel() {
  const [view, setView] = useState<FollowupsView>("tracker");
  const selectedTargets = useHermesStore((s) => s.selectedTargets);
  const { contacts, due, loading, error, addContact, updateContact, removeContact } =
    useContacts();
  const [targetIndex, setTargetIndex] = useState(0);

  const activeTarget = selectedTargets[targetIndex] ?? selectedTargets[0];
  const dueIds = new Set(due.map((c) => c.id));

  const logOutreach = async () => {
    if (!activeTarget) return;
    await addContact({
      company: activeTarget.company,
      personName: activeTarget.name,
      personRole: activeTarget.role,
      linkedinUrl: activeTarget.linkedinUrl,
      schoolConnection: activeTarget.schoolConnection,
      status: "contacted",
    });
  };

  const addProspect = async () => {
    if (!activeTarget) return;
    const exists = contacts.some(
      (c) =>
        c.linkedinUrl === activeTarget.linkedinUrl ||
        (c.personName === activeTarget.name && c.company === activeTarget.company)
    );
    if (exists) return;
    await addContact({
      company: activeTarget.company,
      personName: activeTarget.name,
      personRole: activeTarget.role,
      linkedinUrl: activeTarget.linkedinUrl,
      schoolConnection: activeTarget.schoolConnection,
      status: "prospect",
    });
  };

  const handleUpdate = async (
    id: string,
    patch: { status?: ContactStatus; followupDate?: string; notes?: string }
  ) => {
    await updateContact(id, patch);
  };

  return (
    <div className="hermes-followups-panel">
      <header className="hermes-followups-panel__header">
        <h3 className="hermes-followups-panel__title">Outreach tracker</h3>
        <p className="hermes-followups-panel__desc">
          Log sends, change status, and track follow-up dates. Pipeline view shows your full
          hunt board.
        </p>
      </header>

      <div className="hermes-followups-panel__tabs">
        <button
          type="button"
          className={`hermes-profile-workspace__tab ${view === "tracker" ? "hermes-profile-workspace__tab--active" : ""}`}
          onClick={() => setView("tracker")}
        >
          List
        </button>
        <button
          type="button"
          className={`hermes-profile-workspace__tab ${view === "pipeline" ? "hermes-profile-workspace__tab--active" : ""}`}
          onClick={() => setView("pipeline")}
        >
          Pipeline
        </button>
      </div>

      {selectedTargets.length > 0 && (
        <div className="hermes-followups-panel__quick">
          {selectedTargets.length > 1 && (
            <select
              className="hermes-tracker-card__status"
              value={targetIndex}
              onChange={(e) => setTargetIndex(Number(e.target.value))}
            >
              {selectedTargets.map((t, i) => (
                <option key={t.id} value={i}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
          <button type="button" className="vl-btn" onClick={() => void addProspect()}>
            Add to pipeline
          </button>
          <button
            type="button"
            className="vl-btn vl-btn--primary"
            onClick={() => void logOutreach()}
          >
            Log outreach sent
          </button>
        </div>
      )}

      {loading && <p className="hermes-panel-empty">Loading…</p>}
      {error && <p className="hermes-profile-import-error">{error}</p>}

      <div className="hermes-followups-panel__scroll">
        {view === "pipeline" ? (
          <PipelineKanban
            contacts={contacts}
            onMove={(id, status) => void handleUpdate(id, { status })}
            onRemove={(id) => void removeContact(id)}
          />
        ) : (
          <>
            <section className="hermes-followups-section">
              <h4 className="hermes-followups-section__title">Due now</h4>
              {due.length === 0 ? (
                <p className="hermes-panel-empty">No follow-ups due today.</p>
              ) : (
                <div className="hermes-tracker-list">
                  {due.map((c) => (
                    <ContactTrackerCard
                      key={c.id}
                      contact={c}
                      highlightDue
                      onUpdate={handleUpdate}
                      onRemove={(id) => void removeContact(id)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="hermes-followups-section">
              <h4 className="hermes-followups-section__title">
                All contacts ({contacts.length})
              </h4>
              {contacts.length === 0 ? (
                <p className="hermes-panel-empty">
                  Add people from People Finder, or log outreach after you message someone.
                </p>
              ) : (
                <div className="hermes-tracker-list">
                  {contacts.map((c) => (
                    <ContactTrackerCard
                      key={c.id}
                      contact={c}
                      highlightDue={dueIds.has(c.id)}
                      onUpdate={handleUpdate}
                      onRemove={(id) => void removeContact(id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
