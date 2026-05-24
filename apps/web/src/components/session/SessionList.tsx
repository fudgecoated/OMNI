import type { MouseEvent } from "react";
import { useSessionStore } from "../../stores/sessionStore";

function formatWhen(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

interface Props {
  variant: "finder" | "chat";
  onSelect?: () => void;
}

export function SessionList({ variant, onSelect }: Props) {
  const sessions = useSessionStore((s) => s.sessions);
  const activeId = useSessionStore((s) => s.activeId);
  const createSession = useSessionStore((s) => s.createSession);
  const selectSession = useSessionStore((s) => s.selectSession);
  const deleteSession = useSessionStore((s) => s.deleteSession);

  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  const openSession = (id: string) => {
    selectSession(id);
    onSelect?.();
  };

  /** Sole entry point for a new finder pin / outreach thread (no duplicate buttons in center or right panels). */
  const handleNew = () => {
    createSession();
    onSelect?.();
  };

  const handleDelete = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    const session = sessions.find((s) => s.id === id);
    const label = session?.searchTitle ?? "this pin";
    if (!window.confirm(`Delete "${label}" and its chat? This cannot be undone.`)) return;
    deleteSession(id);
  };

  const newLabel = variant === "finder" ? "+ New search" : "+ New chat";
  const emptyLabel =
    variant === "finder"
      ? "No searches yet. Run a find or start a new search."
      : "No conversations yet.";

  return (
    <div className="conversation-list session-list">
      <button type="button" className="vl-btn vl-btn--primary conversation-list__new" onClick={handleNew}>
        {newLabel}
      </button>

      {sorted.length === 0 ? (
        <p className="hermes-sidebar-hint">{emptyLabel}</p>
      ) : (
        <ul className="conversation-list__items" aria-label="Search and chat history">
          {sorted.map((s) => {
            const msgCount = s.messages.length;
            const resultCount = s.results.length;
            const meta =
              variant === "finder"
                ? `${resultCount} contact${resultCount === 1 ? "" : "s"} · ${msgCount} msg${msgCount === 1 ? "" : "s"}`
                : `${msgCount} msg${msgCount === 1 ? "" : "s"} · ${resultCount} found`;

            return (
              <li key={s.id}>
                <div
                  role="button"
                  tabIndex={0}
                  className={`conversation-list__item session-list__item ${s.id === activeId ? "conversation-list__item--active" : ""}`}
                  onClick={() => openSession(s.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openSession(s.id);
                    }
                  }}
                >
                  <span className="conversation-list__title">{s.searchTitle}</span>
                  {s.chatTitle !== s.searchTitle && s.messages.length > 0 && (
                    <span className="session-list__subtitle">{s.chatTitle}</span>
                  )}
                  <span className="conversation-list__meta">{formatWhen(s.updatedAt)}</span>
                  <span className="session-list__badge">{meta}</span>
                  <button
                    type="button"
                    className="conversation-list__delete"
                    aria-label={`Delete ${s.searchTitle}`}
                    onClick={(e) => handleDelete(e, s.id)}
                  >
                    ×
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
