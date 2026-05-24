import type { OutreachTarget } from "@hermes/shared";
import { parseContactsFromMarkdown } from "../../lib/parseContactsFromMarkdown";
import { useHermesStore } from "../../stores/hermesStore";

interface Props {
  messageText: string;
  disabled?: boolean;
}

export function ChatContactPicker({ messageText, disabled }: Props) {
  const contacts = parseContactsFromMarkdown(messageText);
  const selectedTargets = useHermesStore((s) => s.selectedTargets);
  const addTarget = useHermesStore((s) => s.addTarget);
  const setResultsTab = useHermesStore((s) => s.setResultsTab);

  if (contacts.length === 0 || disabled) return null;

  const selectedIds = new Set(selectedTargets.map((t) => t.id));

  const addOne = (c: OutreachTarget) => {
    addTarget(c);
    setResultsTab("person");
  };

  const addAll = () => {
    for (const c of contacts) {
      if (!selectedIds.has(c.id)) addTarget(c);
    }
    setResultsTab("person");
  };

  const allAdded = contacts.every((c) => selectedIds.has(c.id));

  return (
    <div className="chat-contact-picker" data-testid="chat-contact-picker">
      <div className="chat-contact-picker__header">
        <span>
          {contacts.length} contact{contacts.length === 1 ? "" : "s"} in this message
        </span>
        {!allAdded && (
          <button type="button" className="vl-chip" onClick={addAll}>
            Add all to outreach
          </button>
        )}
        {allAdded && (
          <span className="chat-contact-picker__added">All added ✓</span>
        )}
      </div>
      <ul className="chat-contact-picker__list">
        {contacts.map((c) => {
          const added = selectedIds.has(c.id);
          return (
            <li key={c.id} className="chat-contact-picker__item">
              <div className="chat-contact-picker__info">
                <strong>{c.name}</strong>
                <span>{c.role}</span>
              </div>
              <button
                type="button"
                className={`vl-chip ${added ? "chat-contact-picker__btn--added" : ""}`}
                disabled={added}
                onClick={() => addOne(c)}
              >
                {added ? "Added" : "Add"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
