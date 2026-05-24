import { useState } from "react";
import { useProfileStore } from "../../stores/profileStore";
import { useProfileIngest } from "../../hooks/useProfileIngest";

const TEXT_TYPES = /\.(txt|md|markdown|json|csv|log)$/i;
const MAX_FILE_BYTES = 80_000;

async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function ProfileSources() {
  const sources = useProfileStore((s) => s.sources);
  const setSourceLinks = useProfileStore((s) => s.setSourceLinks);
  const addSourceFile = useProfileStore((s) => s.addSourceFile);
  const removeSourceFile = useProfileStore((s) => s.removeSourceFile);
  const { ingest, loading, error, clearError } = useProfileIngest();
  const [linkInput, setLinkInput] = useState(sources.links.join("\n"));
  const [fileError, setFileError] = useState<string | null>(null);

  const syncLinks = () => {
    const links = linkInput
      .split(/\n|,/)
      .map((l) => l.trim())
      .filter(Boolean);
    setSourceLinks(links);
    return links;
  };

  const onFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setFileError(null);
    for (const file of Array.from(fileList)) {
      if (!TEXT_TYPES.test(file.name) && file.type && !file.type.startsWith("text/")) {
        setFileError(`Skipped ${file.name}. Use .txt, .md, or .json (or paste in chat).`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setFileError(`${file.name} is too large (max ${MAX_FILE_BYTES / 1000}KB).`);
        continue;
      }
      try {
        const text = await readFileAsText(file);
        addSourceFile({ name: file.name, text: text.slice(0, MAX_FILE_BYTES) });
      } catch {
        setFileError(`Could not read ${file.name}`);
      }
    }
  };

  const runImport = async () => {
    clearError();
    syncLinks();
    await ingest();
  };

  return (
    <section className="hermes-profile-card hermes-profile-card--sources">
      <div className="hermes-profile-card__head">
        <h3 className="hermes-profile-card__title">Sources</h3>
        <p className="hermes-profile-card__desc">
          Add a resume, README, or links. Weave reads them and fills your profile + context markdown.
        </p>
      </div>

      <label className="hermes-profile-field">
        <span className="hermes-profile-field__label">Links</span>
        <textarea
          className="hermes-profile-textarea"
          rows={2}
          placeholder="GitHub, LinkedIn, portfolio, one per line"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          onBlur={syncLinks}
        />
      </label>

      <div className="hermes-profile-field">
        <span className="hermes-profile-field__label">Files</span>
        <label className="hermes-profile-dropzone">
          <input
            type="file"
            accept=".txt,.md,.markdown,.json,.csv,text/plain,text/markdown"
            multiple
            className="hermes-profile-dropzone__input"
            onChange={(e) => void onFiles(e.target.files)}
          />
          <span>Drop or click to add .txt, .md, .json</span>
        </label>
        {sources.files.length > 0 && (
          <ul className="hermes-profile-file-list">
            {sources.files.map((f) => (
              <li key={f.id}>
                <span>{f.name}</span>
                <button type="button" className="vl-chip" onClick={() => removeSourceFile(f.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {(fileError || error) && (
        <p className="hermes-profile-import-error">{fileError ?? error}</p>
      )}

      <button
        type="button"
        className="vl-btn vl-btn--primary hermes-profile-import-btn"
        disabled={loading}
        onClick={() => void runImport()}
      >
        {loading ? "Reading sources..." : "Import with Weave"}
      </button>
    </section>
  );
}
