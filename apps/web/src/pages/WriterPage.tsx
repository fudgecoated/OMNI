import { useState } from "react";
import type { MessageTemplateType, Person } from "@hermes/shared";
import { DEFAULT_STUDENT } from "../constants";
import { useMessageWriter } from "../hooks/useMessageWriter";

interface WriterPageProps {
  selectedPerson: Person | null;
}

export function WriterPage({ selectedPerson }: WriterPageProps) {
  const { result, loading, error, generate } = useMessageWriter();
  const [templateType, setTemplateType] =
    useState<MessageTemplateType>("cold_email");
  const [studentJson, setStudentJson] = useState(
    JSON.stringify(DEFAULT_STUDENT, null, 2)
  );

  const handleGenerate = () => {
    if (!selectedPerson) return;
    try {
      const student = JSON.parse(studentJson) as typeof DEFAULT_STUDENT;
      void generate(selectedPerson, student, templateType);
    } catch {
      alert("Invalid student JSON");
    }
  };

  const copyText = () => {
    if (!result) return;
    const text = result.subject
      ? `Subject: ${result.subject}\n\n${result.body}`
      : result.body;
    void navigator.clipboard.writeText(text);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Message Writer</h2>
      {!selectedPerson ? (
        <p className="text-sm text-amber-400">
          Select a person from People Finder first.
        </p>
      ) : (
        <p className="text-sm text-gray-400">
          Writing to <strong>{selectedPerson.name}</strong> at{" "}
          {selectedPerson.company}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <select
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2"
          value={templateType}
          onChange={(e) =>
            setTemplateType(e.target.value as MessageTemplateType)
          }
        >
          <option value="connection_request">LinkedIn connection (short)</option>
          <option value="cold_email">Cold email / LinkedIn message</option>
        </select>
        <button
          type="button"
          disabled={!selectedPerson || loading}
          className="rounded-lg bg-sky-600 px-4 py-2 font-medium hover:bg-sky-500 disabled:opacity-50"
          onClick={handleGenerate}
        >
          Generate
        </button>
        {result && (
          <button
            type="button"
            className="rounded-lg border border-gray-600 px-4 py-2 text-sm hover:bg-gray-800"
            onClick={copyText}
          >
            Copy
          </button>
        )}
      </div>

      <label className="block text-sm text-gray-400">
        Student profile (JSON)
        <textarea
          className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-900 p-3 font-mono text-xs"
          rows={8}
          value={studentJson}
          onChange={(e) => setStudentJson(e.target.value)}
        />
      </label>

      {loading && <p className="text-sm text-gray-400">Generating…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {result && (
        <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-4">
          {result.subject && (
            <p className="mb-2 text-sm">
              <span className="text-gray-500">Subject:</span> {result.subject}
            </p>
          )}
          <pre className="whitespace-pre-wrap font-sans text-sm">{result.body}</pre>
        </div>
      )}
    </section>
  );
}
