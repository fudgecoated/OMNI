import { useEffect, useState } from "react";
import { useFinder } from "../../hooks/useFinder";

const DEFAULT_COMPANY = "Google";
const DEFAULT_ROLE = "software engineering intern";
const DEFAULT_CITY = "Calgary";

export function FinderSearchForm() {
  const { search, loading, error, activeSession } = useFinder();
  const [elapsed, setElapsed] = useState(0);
  const query = activeSession?.query;

  const [company, setCompany] = useState(query?.company || DEFAULT_COMPANY);
  const [role, setRole] = useState(query?.role ?? DEFAULT_ROLE);
  const [teamFocus, setTeamFocus] = useState(query?.teamFocus ?? "");
  const [city, setCity] = useState(query?.city ?? DEFAULT_CITY);
  const [school, setSchool] = useState(query?.school ?? "");

  useEffect(() => {
    if (!query) return;
    setCompany(query.company || DEFAULT_COMPANY);
    setRole(query.role ?? DEFAULT_ROLE);
    setTeamFocus(query.teamFocus ?? "");
    setCity(query.city ?? DEFAULT_CITY);
    setSchool(query.school ?? "");
  }, [
    activeSession?.id,
    query?.company,
    query?.role,
    query?.teamFocus,
    query?.city,
    query?.school,
  ]);

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
    void search(company, role, city, school, teamFocus);
  };

  return (
    <div className="hermes-finder-search">
      <header className="hermes-finder-search__hero">
        <div className="hermes-finder-search__hero-main">
          <div>
            <div className="hermes-finder-search__eyebrow">People Finder</div>
            <h1 className="hermes-finder-search__title">Company-aware contact search</h1>
            <p className="hermes-finder-search__subtitle">
              Run one search, then use the ranked contacts, company brief, and coaching thread to
              decide who deserves the first message.
            </p>
          </div>
          <img
            src="/brand-icons/network.png"
            alt=""
            className="hermes-finder-search__hero-icon"
          />
        </div>

        <div className="hermes-finder-search__signals" aria-label="Search signals Weave uses">
          <span className="hermes-signal-card hermes-signal-card--gold">
            <strong>Company context</strong>
            <span>Teams, products, timing</span>
          </span>
          <span className="hermes-signal-card hermes-signal-card--sage">
            <strong>Warm paths</strong>
            <span>Alumni and local ties</span>
          </span>
          <span className="hermes-signal-card hermes-signal-card--terra">
            <strong>Personal angles</strong>
            <span>Skills, interests, goals</span>
          </span>
        </div>
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
            placeholder="e.g. SWE intern, product owner"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
        </label>
        <label className="hermes-profile-field">
          <span className="hermes-profile-field__label">Team focus (optional)</span>
          <input
            className="hermes-profile-input"
            placeholder="e.g. platform, data, mobile, payments"
            value={teamFocus}
            onChange={(e) => setTeamFocus(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
        </label>
        <div className="hermes-profile-grid hermes-profile-grid--2">
          <label className="hermes-profile-field">
            <span className="hermes-profile-field__label">City</span>
            <input
              className="hermes-profile-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
            />
          </label>
          <label className="hermes-profile-field">
            <span className="hermes-profile-field__label">School filter (optional)</span>
            <input
              className="hermes-profile-input"
              placeholder="Any school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
            />
          </label>
        </div>

        {error && <p className="hermes-profile-import-error">{error}</p>}

        {loading && (
          <p className="hermes-finder-search__progress" role="status">
            Researching company and finding contacts...
            {elapsed > 0 ? ` (${elapsed}s)` : ""}
            <br />
            <span className="hermes-finder-search__progress-hint">
              WestJet uses cached results when available (~2s). Other companies use live AI and
              can take 1-2 minutes.
            </span>
          </p>
        )}

        {loading && (
          <div className="hermes-finder-search__timeline" aria-hidden={!loading}>
            {["Researching company", "Matching roles", "Ranking contacts", "Preparing angles"].map(
              (step) => (
                <span key={step}>{step}</span>
              )
            )}
          </div>
        )}

        <button
          type="button"
          className="vl-btn vl-btn--primary hermes-finder-search__submit"
          onClick={runSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Find people"}
        </button>
      </div>
    </div>
  );
}
