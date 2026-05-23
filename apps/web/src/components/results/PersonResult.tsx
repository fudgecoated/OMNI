import { useHermesStore } from "../../stores/hermesStore";

export function PersonResult() {
  const person = useHermesStore((s) => s.selectedPerson);

  if (!person) {
    return (
      <div className="hermes-result-block">
        <p style={{ color: "var(--vl-muted)", fontSize: "0.875rem" }}>
          No person selected. Use People Finder on the left.
        </p>
      </div>
    );
  }

  return (
    <div className="hermes-result-block">
      <h3 style={{ margin: "0 0 0.5rem" }}>{person.name}</h3>
      <p style={{ color: "var(--vl-muted)", fontSize: "0.875rem", margin: "0 0 1rem" }}>
        {person.role} · {person.team}
      </p>
      <dl style={{ fontSize: "0.875rem", margin: 0 }}>
        <dt style={{ fontWeight: 600, marginTop: "0.75rem" }}>Company</dt>
        <dd style={{ margin: "0.25rem 0 0", textTransform: "capitalize" }}>
          {person.company}
        </dd>
        <dt style={{ fontWeight: 600, marginTop: "0.75rem" }}>Relevance</dt>
        <dd style={{ margin: "0.25rem 0 0" }}>{person.relevanceScore} / 100</dd>
        {person.schoolConnection && (
          <>
            <dt style={{ fontWeight: 600, marginTop: "0.75rem" }}>School tie</dt>
            <dd style={{ margin: "0.25rem 0 0", color: "#059669" }}>
              {person.schoolConnection}
            </dd>
          </>
        )}
        <dt style={{ fontWeight: 600, marginTop: "0.75rem" }}>Contact</dt>
        <dd style={{ margin: "0.25rem 0 0" }}>
          {person.contactMethod}
          {person.email ? ` · ${person.email}` : ""}
        </dd>
        <dt style={{ fontWeight: 600, marginTop: "0.75rem" }}>LinkedIn</dt>
        <dd style={{ margin: "0.25rem 0 0", wordBreak: "break-all" }}>
          <a href={person.linkedinUrl} target="_blank" rel="noreferrer">
            {person.linkedinUrl}
          </a>
        </dd>
      </dl>
    </div>
  );
}
