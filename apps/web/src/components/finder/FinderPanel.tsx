import { useEffect, useState } from "react";
import type { CompanySlug } from "@hermes/shared";
import { COMPANIES } from "../../constants";
import { useFinder } from "../../hooks/useFinder";
import { useHermesStore } from "../../stores/hermesStore";

export function FinderPanel() {
  const company = useHermesStore((s) => s.company);
  const setCompany = useHermesStore((s) => s.setCompany);
  const selectedPerson = useHermesStore((s) => s.selectedPerson);
  const selectPerson = useHermesStore((s) => s.selectPerson);
  const setSidebarSection = useHermesStore((s) => s.setSidebarSection);

  const { people, loading, error, search } = useFinder();
  const [role, setRole] = useState("");
  const [school, setSchool] = useState("ucalgary");

  useEffect(() => {
    void search(company, role, school);
  }, [company, role, school, search]);

  return (
    <div style={{ padding: "0 0.375rem 0.75rem" }}>
      <select
        className="vl-menu__search"
        style={{ margin: "0 0 0.5rem", width: "calc(100% - 0px)" }}
        value={company}
        onChange={(e) => setCompany(e.target.value as CompanySlug)}
        aria-label="Target company"
      >
        {COMPANIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        className="vl-menu__search"
        style={{ margin: "0 0 0.375rem" }}
        placeholder="Role / team"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <input
        className="vl-menu__search"
        style={{ margin: "0 0 0.5rem" }}
        placeholder="School"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
      />
      <button
        type="button"
        className="vl-btn vl-btn--primary"
        style={{ width: "100%", marginBottom: "0.5rem" }}
        onClick={() => void search(company, role, school)}
      >
        Search
      </button>

      {loading && (
        <p style={{ fontSize: "0.75rem", color: "var(--vl-menu-muted)", margin: "0 0.5rem" }}>
          Searching…
        </p>
      )}
      {error && (
        <p style={{ fontSize: "0.75rem", color: "#b91c1c", margin: "0 0.5rem" }}>{error}</p>
      )}

      <div style={{ maxHeight: 280, overflowY: "auto" }}>
        {people.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`hermes-finder-person ${selectedPerson?.id === p.id ? "hermes-finder-person--active" : ""}`}
            onClick={() => {
              selectPerson(p);
              setSidebarSection("chat");
            }}
          >
            <div className="hermes-finder-person__name">{p.name}</div>
            <div className="hermes-finder-person__meta">
              {p.role} · score {p.relevanceScore}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
