import { useEffect, useState } from "react";
import type { MessageTemplateType } from "@hermes/shared";
import { useHermesStore } from "../../stores/hermesStore";
import { useProfileStore } from "../../stores/profileStore";
import { useSessionStore } from "../../stores/sessionStore";
import { useMessageWriter } from "../../hooks/useMessageWriter";
import { targetToPerson } from "../../lib/outreach";

export function MessageResult() {
  const selectedTargets = useHermesStore((s) => s.selectedTargets);
  const student = useProfileStore((s) => s.profile);
  const generatedMessage = useHermesStore((s) => s.generatedMessage);
  const setGeneratedMessage = useHermesStore((s) => s.setGeneratedMessage);
  const setSidebarSection = useHermesStore((s) => s.setSidebarSection);
  const { result, loading, error, generate } = useMessageWriter();
  const [templateType, setTemplateType] =
    useState<MessageTemplateType>("cold_email");
  const [targetIndex, setTargetIndex] = useState(0);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedBody, setEditedBody] = useState("");

  const outreachContext = useSessionStore((s) =>
    s.sessions.find((sess) => sess.id === s.activeId)?.outreachContext
  );
  const activeTarget = selectedTargets[targetIndex] ?? selectedTargets[0];
  const display = result ?? generatedMessage;

  useEffect(() => {
    if (!display) {
      setEditedSubject("");
      setEditedBody("");
      return;
    }
    setEditedSubject(display.subject ?? "");
    setEditedBody(display.body ?? "");
  }, [display, activeTarget?.id]);

  const persistEdits = (subject: string, body: string) => {
    if (!display) return;
    setGeneratedMessage({
      subject,
      body,
      templateType: display.templateType,
    });
  };

  const handleGenerate = () => {
    if (!activeTarget) return;
    void generate(
      targetToPerson(activeTarget),
      student,
      templateType,
      outreachContext
    ).then((data) => {
      if (data) setGeneratedMessage(data);
    });
  };

  const copy = () => {
    if (!editedBody.trim() && !editedSubject.trim()) return;
    const text = editedSubject.trim()
      ? `Subject: ${editedSubject.trim()}\n\n${editedBody}`
      : editedBody;
    void navigator.clipboard.writeText(text);
  };

  return (
    <div className="hermes-result-block hermes-message-result">
      <h3 className="hermes-message-result__title">Generated outreach</h3>
      {selectedTargets.length === 0 ? (
        <p style={{ color: "var(--vl-muted)", fontSize: "0.875rem" }}>
          Select contacts in{" "}
          <button
            type="button"
            className="hermes-inline-link"
            onClick={() => setSidebarSection("finder")}
          >
            People Finder
          </button>{" "}
          to generate a message.
        </p>
      ) : (
        <>
          <div className="hermes-message-result__toolbar">
            {selectedTargets.length > 1 && (
              <label className="hermes-message-result__field">
                <span className="hermes-message-result__label">Draft for</span>
                <select
                  className="hermes-profile-input"
                  value={targetIndex}
                  onChange={(e) => setTargetIndex(Number(e.target.value))}
                >
                  {selectedTargets.map((t, i) => (
                    <option key={t.id} value={i}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="hermes-message-result__field">
              <span className="hermes-message-result__label">Message type</span>
              <select
                className="hermes-profile-input"
                value={templateType}
                onChange={(e) =>
                  setTemplateType(e.target.value as MessageTemplateType)
                }
              >
                <option value="connection_request">Connection request</option>
                <option value="cold_email">Cold email / DM</option>
              </select>
            </label>
            <div className="hermes-message-result__actions">
              <button
                type="button"
                className="vl-btn vl-btn--primary"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? "Generating…" : "Generate draft"}
              </button>
              {(editedBody || editedSubject) && (
                <button type="button" className="vl-btn" onClick={copy}>
                  Copy
                </button>
              )}
            </div>
          </div>

          <p className="hermes-message-result__hint">
            Edit the draft below before you send. Hermes does not auto-send.
          </p>

          {error && <p className="hermes-profile-import-error">{error}</p>}

          {(display || editedBody) && (
            <div className="hermes-message-result__editor">
              <label className="hermes-message-result__field">
                <span className="hermes-message-result__label">Subject</span>
                <input
                  className="hermes-profile-input hermes-message-result__subject"
                  value={editedSubject}
                  onChange={(e) => {
                    setEditedSubject(e.target.value);
                    persistEdits(e.target.value, editedBody);
                  }}
                  placeholder="Email subject line"
                />
              </label>
              <label className="hermes-message-result__field hermes-message-result__field--message">
                <span className="hermes-message-result__label">Message</span>
                <textarea
                  className="hermes-profile-textarea hermes-message-draft__body"
                  value={editedBody}
                  onChange={(e) => {
                    setEditedBody(e.target.value);
                    persistEdits(editedSubject, e.target.value);
                  }}
                  placeholder="Your outreach message…"
                />
              </label>
            </div>
          )}
        </>
      )}
    </div>
  );
}
