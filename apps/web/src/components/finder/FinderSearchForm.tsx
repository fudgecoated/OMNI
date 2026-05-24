import { useEffect, useState } from "react";
import { useFinder } from "../../hooks/useFinder";

const DEFAULT_COMPANY = "Google";
const DEFAULT_ROLE = "software engineering intern";
const DEFAULT_CITY = "Calgary";

const SIGNAL_CHIPS = [
  "Company context",
  "Warm paths",
  "Personal angles",
] as const;

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
    <div className="hermes-finder-search__form--compact">
      <div className="hermes-finder-search__intro">
        <p className="hermes-finder-search__lead">Find people at your target company</p>
        <p className="hermes-finder-search__demo-hint">
          Try <strong>WestJet</strong> or <strong>Google</strong> for a fast demo.
        </p>
        <div className="hermes-finder-search__chips" aria-label="What Weave uses in search">
          {SIGNAL_CHIPS.map((label) => (
            <span key={label} className="hermes-finder-search__chip">
              {label}
            </span>
          ))}
        </div>
      </div>

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
            <span className="hermes-finder-search__progress-hint">
              Instant demos: WestJet, Google, Amazon, or Meta. Other companies use live AI (1–2
              min; may time out on the free tier).
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
  );
}
