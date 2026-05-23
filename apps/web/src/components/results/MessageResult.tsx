import { useState } from "react";
import type { MessageTemplateType } from "@hermes/shared";
import { useHermesStore } from "../../stores/hermesStore";
import { useMessageWriter } from "../../hooks/useMessageWriter";

export function MessageResult() {
  const selectedPerson = useHermesStore((s) => s.selectedPerson);
  const student = useHermesStore((s) => s.student);
  const generatedMessage = useHermesStore((s) => s.generatedMessage);
  const setGeneratedMessage = useHermesStore((s) => s.setGeneratedMessage);
  const { result, loading, error, generate } = useMessageWriter();
  const [templateType, setTemplateType] =
    useState<MessageTemplateType>("cold_email");

  const display = result ?? generatedMessage;

  const handleGenerate = () => {
    if (!selectedPerson) return;
    void generate(selectedPerson, student, templateType).then((data) => {
      if (data) setGeneratedMessage(data);
    });
  };

  const copy = () => {
    if (!display) return;
    const text = display.subject
      ? `Subject: ${display.subject}\n\n${display.body}`
      : display.body;
    void navigator.clipboard.writeText(text);
  };

  return (
    <div className="hermes-result-block">
      <h3 style={{ margin: "0 0 0.75rem", fontSize: "1rem" }}>Generated outreach</h3>
      {!selectedPerson ? (
        <p style={{ color: "var(--vl-muted)", fontSize: "0.875rem" }}>
          Select a person in the left panel to generate a message.
        </p>
      ) : (
        <>
          <div className="hermes-result-actions">
            <select
              value={templateType}
              onChange={(e) =>
                setTemplateType(e.target.value as MessageTemplateType)
              }
              style={{
                padding: "0.35rem 0.5rem",
                borderRadius: 6,
                border: "1px solid var(--vl-border)",
              }}
            >
              <option value="connection_request">Connection request</option>
              <option value="cold_email">Cold email / DM</option>
            </select>
            <button
              type="button"
              className="vl-btn vl-btn--primary"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generating…" : "Generate draft"}
            </button>
            {display && (
              <button type="button" className="vl-btn" onClick={copy}>
                Copy
              </button>
            )}
          </div>
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--vl-muted)",
              marginTop: "0.75rem",
            }}
          >
            Review every message before sending. Hermes does not auto-send.
          </p>
          {error && (
            <p style={{ color: "#b91c1c", fontSize: "0.875rem" }}>{error}</p>
          )}
          {display && (
            <div
              className="vl-tile"
              style={{ marginTop: "1rem", padding: "1rem", borderRadius: 12 }}
            >
              {display.subject && (
                <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  <strong>Subject:</strong> {display.subject}
                </p>
              )}
              <pre
                className="whitespace-pre-wrap"
                style={{
                  margin: 0,
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {display.body}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
