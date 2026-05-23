import { useState } from "react";
import type { CompanySlug, Person } from "@hermes/shared";
import { COMPANIES } from "../constants";
import { useFinder } from "../hooks/useFinder";

interface FinderPageProps {
  onSelectPerson: (person: Person) => void;
}

export function FinderPage({ onSelectPerson }: FinderPageProps) {
  const { people, loading, error, search } = useFinder();
  const [company, setCompany] = useState<CompanySlug>("google");
  const [role, setRole] = useState("");
  const [school, setSchool] = useState("ucalgary");

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">People Finder</h2>
      <p className="text-sm text-gray-400">
        Find employees at target companies. Demo uses seeded mock data.
      </p>

      <div className="flex flex-wrap gap-3">
        <select
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2"
          value={company}
          onChange={(e) => setCompany(e.target.value as CompanySlug)}
        >
          {COMPANIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2"
          placeholder="Filter by role/team"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2"
          placeholder="School connection"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        />
        <button
          type="button"
          className="rounded-lg bg-sky-600 px-4 py-2 font-medium hover:bg-sky-500"
          onClick={() => void search(company, role, school)}
        >
          Search
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400">Searching…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <ul className="space-y-2">
        {people.map((p) => (
          <li
            key={p.id}
            className="flex items-start justify-between gap-4 rounded-lg border border-gray-800 bg-gray-900/60 p-4"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-400">
                {p.role} · {p.team}
              </p>
              {p.schoolConnection && (
                <p className="mt-1 text-sm text-emerald-400">{p.schoolConnection}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Score: {p.relevanceScore} · {p.contactMethod}
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg border border-gray-600 px-3 py-1 text-sm hover:bg-gray-800"
              onClick={() => onSelectPerson(p)}
            >
              Draft message
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
