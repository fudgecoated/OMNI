import { useEffect, useState } from "react";
import { useFinder } from "../../hooks/useFinder";

export function FinderSearchForm() {
  const { search, loading, error, activeSession } = useFinder();
  const [elapsed, setElapsed] = useState(0);
  const query = activeSession?.query;

  const [company, setCompany] = useState(query?.company ?? "");
  const [role, setRole] = useState(query?.role ?? "software engineering intern");
  const [city, setCity] = useState(query?.city ?? "Calgary");
  const [school, setSchool] = useState(query?.school ?? "ucalgary");

  useEffect(() => {
    if (!query) return;
    setCompany(query.company ?? "");
    setRole(query.role ?? "software engineering intern");
    setCity(query.city ?? "Calgary");
    setSchool(query.school ?? "ucalgary");
  }, [activeSession?.id, query?.company, query?.role, query?.city, query?.school]);

  useEffect(() => {
    if (!loading) {
      setElapsed(0);
      return;
    }
    const start = Date.now();
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, [loading]);

  const runSearch = () => {
    void search(company, role, city, school);
  };

  return (
    <div className="hermes-finder-search">
      <header className="hermes-panel-header">
        <h1 className="hermes-panel-header__title">
          {query?.company ? activeSession?.searchTitle ?? "Company search" : "New company search"}
        </h1>
        <p className="hermes-panel-header__subtitle">
          {query?.company
            ? "Run Find people to research the company and load contacts. Company brief appears on the right."
            : "Search a company for this pin. Hermes researches the company, finds contacts, then you can chat about who to message."}
        </p>
      </header>

      <div className="hermes-finder-search__form">
        <label className="hermes-profile-field">
          <span className="hermes-profile-field__label">Company</span>
          <input
            className="hermes-profile-input"
            placeholder="e.g. WestJet, Shopify, Google"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
        </label>
        <label className="hermes-profile-field">
          <span className="hermes-profile-field__label">Role / team</span>
          <input
            className="hermes-profile-input"
            placeholder="e.g. product owner, SWE intern"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </label>
        <div className="hermes-profile-grid hermes-profile-grid--2">
          <label className="hermes-profile-field">
            <span className="hermes-profile-field__label">City</span>
            <input
              className="hermes-profile-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label className="hermes-profile-field">
            <span className="hermes-profile-field__label">School filter</span>
            <input
              className="hermes-profile-input"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </label>
        </div>

        {error && <p className="hermes-profile-import-error">{error}</p>}

        {loading && (
          <p className="hermes-finder-search__progress" role="status">
            Researching company and finding contacts…
            {elapsed > 0 ? ` (${elapsed}s)` : ""}
            <br />
            <span className="hermes-finder-search__progress-hint">
              WestJet uses cached results when available (~2s). Other companies use live AI and
              can take 1–2 minutes.
            </span>
          </p>
        )}

        <button
          type="button"
          className="vl-btn vl-btn--primary hermes-finder-search__submit"
          onClick={runSearch}
          disabled={loading}
        >
          {loading ? "Searching…" : "Find people"}
        </button>
      </div>
    </div>
  );
}
