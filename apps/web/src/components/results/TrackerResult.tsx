import { useHermesStore } from "../../stores/hermesStore";
import { useContacts } from "../../hooks/useContacts";

export function TrackerResult() {
  const selectedPerson = useHermesStore((s) => s.selectedPerson);
  const { contacts, due, loading, error, addContact } = useContacts();

  const logOutreach = async () => {
    if (!selectedPerson) return;
    await addContact({
      company: selectedPerson.company,
      personName: selectedPerson.name,
      personRole: selectedPerson.role,
      linkedinUrl: selectedPerson.linkedinUrl,
      schoolConnection: selectedPerson.schoolConnection,
    });
  };

  return (
    <div className="hermes-result-block">
      <h3 style={{ margin: "0 0 0.75rem", fontSize: "1rem" }}>Follow-ups</h3>

      {selectedPerson && (
        <button
          type="button"
          className="vl-btn vl-btn--primary"
          style={{ marginBottom: "1rem" }}
          onClick={() => void logOutreach()}
        >
          Log outreach to {selectedPerson.name}
        </button>
      )}

      {loading && <p style={{ fontSize: "0.875rem", color: "var(--vl-muted)" }}>Loading…</p>}
      {error && <p style={{ color: "#b91c1c", fontSize: "0.875rem" }}>{error}</p>}

      <h4 style={{ fontSize: "0.875rem", color: "#d97706", margin: "1rem 0 0.5rem" }}>
        Due now
      </h4>
      {due.length === 0 ? (
        <p style={{ fontSize: "0.8rem", color: "var(--vl-muted)" }}>None due.</p>
      ) : (
        <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
          {due.map((c) => (
            <li
              key={c.id}
              className="vl-tile"
              style={{ padding: "0.5rem 0.75rem", marginBottom: 6, fontSize: "0.8rem" }}
            >
              {c.personName} · {c.company} · follow-up {c.followupDate}
            </li>
          ))}
        </ul>
      )}

      <h4 style={{ fontSize: "0.875rem", margin: "1rem 0 0.5rem" }}>All contacts</h4>
      {contacts.length === 0 ? (
        <p style={{ fontSize: "0.8rem", color: "var(--vl-muted)" }}>No contacts yet.</p>
      ) : (
        <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
          {contacts.map((c) => (
            <li
              key={c.id}
              style={{
                fontSize: "0.8rem",
                padding: "0.35rem 0",
                borderBottom: "1px solid var(--vl-border)",
              }}
            >
              <strong>{c.personName}</strong> — {c.status} · {c.firstContactDate}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
