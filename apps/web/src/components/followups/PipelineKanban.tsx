import type { Contact, ContactStatus } from "@hermes/shared";
import { CONTACT_STATUS_LABELS, PIPELINE_COLUMNS } from "@hermes/shared";

export function PipelineKanban({
  contacts,
  onMove,
}: {
  contacts: Contact[];
  onMove: (id: string, status: ContactStatus) => void;
}) {
  return (
    <div className="hermes-kanban">
      {PIPELINE_COLUMNS.map((col) => {
        const cards = contacts.filter((c) => c.status === col.id);
        return (
          <div key={col.id} className="hermes-kanban__column">
            <header className="hermes-kanban__column-head">
              <span className="hermes-kanban__column-title">{col.label}</span>
              <span className="hermes-kanban__column-count">{cards.length}</span>
              <p className="hermes-kanban__column-hint">{col.hint}</p>
            </header>
            <div className="hermes-kanban__cards">
              {cards.length === 0 ? (
                <p className="hermes-kanban__empty">—</p>
              ) : (
                cards.map((c) => (
                  <div key={c.id} className="hermes-kanban__card">
                    <strong>{c.personName}</strong>
                    <span className="hermes-kanban__card-meta">
                      {c.company}
                      {c.personRole ? ` · ${c.personRole}` : ""}
                    </span>
                    <select
                      className="hermes-kanban__move"
                      value={c.status}
                      aria-label={`Move ${c.personName}`}
                      onChange={(e) => onMove(c.id, e.target.value as ContactStatus)}
                    >
                      {PIPELINE_COLUMNS.map((p) => (
                        <option key={p.id} value={p.id}>
                          → {CONTACT_STATUS_LABELS[p.id]}
                        </option>
                      ))}
                    </select>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
