import { useState } from "react";
import type { Contact, ContactStatus } from "@hermes/shared";
import { CONTACT_STATUS_LABELS, PIPELINE_COLUMNS } from "@hermes/shared";

const STATUS_OPTIONS = PIPELINE_COLUMNS.map((c) => c.id);

export function ContactTrackerCard({
  contact,
  onUpdate,
  highlightDue,
}: {
  contact: Contact;
  onUpdate: (id: string, patch: { status?: ContactStatus; followupDate?: string; notes?: string }) => void;
  highlightDue?: boolean;
}) {
  const [notes, setNotes] = useState(contact.notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);

  const saveNotes = () => {
    if (notes === (contact.notes ?? "")) return;
    setSavingNotes(true);
    void onUpdate(contact.id, { notes }).finally(() => setSavingNotes(false));
  };

  return (
    <article
      className={`hermes-tracker-card ${highlightDue ? "hermes-tracker-card--due" : ""}`}
    >
      <div className="hermes-tracker-card__head">
        <div>
          <strong className="hermes-tracker-card__name">{contact.personName}</strong>
          <p className="hermes-tracker-card__meta">
            {contact.personRole} · {contact.company}
          </p>
        </div>
        <select
          className="hermes-tracker-card__status"
          value={contact.status}
          aria-label={`Status for ${contact.personName}`}
          onChange={(e) =>
            void onUpdate(contact.id, { status: e.target.value as ContactStatus })
          }
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {CONTACT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="hermes-tracker-card__dates">
        <span>First contact: {contact.firstContactDate}</span>
        {contact.followupDate && (
          <span>
            Follow-up:{" "}
            <input
              type="date"
              className="hermes-tracker-card__date-input"
              value={contact.followupDate}
              onChange={(e) =>
                void onUpdate(contact.id, { followupDate: e.target.value })
              }
            />
          </span>
        )}
      </div>

      {contact.linkedinUrl && (
        <a
          href={contact.linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="hermes-inline-link hermes-tracker-card__link"
        >
          LinkedIn
        </a>
      )}

      <label className="hermes-tracker-card__notes-label">
        Notes
        <textarea
          className="hermes-profile-textarea"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveNotes}
          placeholder="Reply summary, next step…"
        />
      </label>
      {savingNotes && <span className="hermes-tracker-card__saving">Saving…</span>}
    </article>
  );
}
