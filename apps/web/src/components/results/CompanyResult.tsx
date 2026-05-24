import type { OutreachContext } from "@hermes/shared";
import { useSessionStore } from "../../stores/sessionStore";
import { useHermesStore } from "../../stores/hermesStore";

export function CompanyResult() {
  const context = useSessionStore((s) =>
    s.sessions.find((sess) => sess.id === s.activeId)?.outreachContext
  );
  const finderCompany = useHermesStore((s) => s.finderCompany);
  const activeSession = useSessionStore((s) =>
    s.sessions.find((sess) => sess.id === s.activeId)
  );

  if (!context?.company?.summary) {
    return (
      <div className="hermes-result-block">
        <div className="hermes-company-empty">
          <div className="weave-empty-brief__head">
            <img src="/brand-icons/draft.png" alt="" className="weave-empty-brief__icon" />
            <div>
              <p className="hermes-results-eyebrow">Company brief</p>
              <h3 className="hermes-company-empty__title">
                Research appears after your first search.
              </h3>
            </div>
          </div>
          <p className="hermes-company-empty__text">
            Run <strong>Find people</strong> for {finderCompany || "a company"} to load the
            company context, hiring signals, and outreach angles that support the ranked contacts.
          </p>
          <div className="weave-brief-preview" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="hermes-company-empty__signals" aria-hidden="true">
            <span>Hiring signals</span>
            <span>Role context</span>
            <span>Message angles</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CompanyBrief context={context} resultCount={activeSession?.results.length ?? 0} />
  );
}

function CompanyBrief({
  context,
  resultCount,
}: {
  context: OutreachContext;
  resultCount: number;
}) {
  const company = context.company!;
  const role = context.jobRole;

  return (
    <div className="hermes-result-block">
      <h3 style={{ margin: "0 0 0.75rem" }}>{company.company}</h3>
      <p style={{ lineHeight: 1.45, fontSize: "0.875rem" }}>{company.summary}</p>

      {company.hiringSignals.length > 0 && (
        <>
          <h4 style={{ margin: "1rem 0 0.35rem", fontSize: "0.8rem" }}>Hiring signals</h4>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.8125rem" }}>
            {company.hiringSignals.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </>
      )}

      {role && (
        <>
          <h4 style={{ margin: "1rem 0 0.35rem", fontSize: "0.8rem" }}>
            Role context - {role.roleTitle}
          </h4>
          <p style={{ fontSize: "0.8125rem", margin: 0 }}>{role.summary}</p>
          {role.skillsToEmphasize.length > 0 && (
            <p style={{ fontSize: "0.75rem", margin: "0.5rem 0 0", color: "var(--vl-muted)" }}>
              Emphasize: {role.skillsToEmphasize.join(", ")}
            </p>
          )}
        </>
      )}

      <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--vl-muted)" }}>
        {resultCount} contact{resultCount === 1 ? "" : "s"} in this pin
      </p>
    </div>
  );
}
