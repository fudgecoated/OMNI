import type { ReactNode } from "react";
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
            company context, hiring signals, and a personalized playbook for applying and
            outreach.
          </p>
          <div className="weave-brief-preview" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="hermes-company-empty__signals" aria-hidden="true">
            <span>Hiring signals</span>
            <span>How to apply</span>
            <span>What to learn</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CompanyBrief context={context} resultCount={activeSession?.results.length ?? 0} />
  );
}

function BriefSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="hermes-company-brief__section">
      <h4 className="hermes-company-brief__heading">{title}</h4>
      {children}
    </section>
  );
}

function BriefList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="hermes-company-brief__list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
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
  const guidance = context.guidance;

  return (
    <div className="hermes-result-block hermes-company-brief">
      <h3 className="hermes-company-brief__title">{company.company}</h3>
      <p className="hermes-company-brief__summary">{company.summary}</p>

      {guidance && guidance.applyApproach.length > 0 && (
        <BriefSection title="How to approach applying">
          <BriefList items={guidance.applyApproach} />
        </BriefSection>
      )}

      {guidance && guidance.skillsToLearn.length > 0 && (
        <BriefSection title="What to learn next">
          <BriefList items={guidance.skillsToLearn} />
        </BriefSection>
      )}

      {guidance && guidance.outreachStrategy.length > 0 && (
        <BriefSection title="Outreach strategy">
          <BriefList items={guidance.outreachStrategy} />
        </BriefSection>
      )}

      {company.productsAndTeams.length > 0 && (
        <BriefSection title="Teams and products">
          <BriefList items={company.productsAndTeams.slice(0, 6)} />
        </BriefSection>
      )}

      {company.hiringSignals.length > 0 && (
        <BriefSection title="Hiring signals">
          <BriefList items={company.hiringSignals} />
        </BriefSection>
      )}

      {company.recentNews.length > 0 && (
        <BriefSection title="Recent news">
          <BriefList items={company.recentNews.slice(0, 4)} />
        </BriefSection>
      )}

      {company.techStack.length > 0 && (
        <BriefSection title="Tech stack">
          <BriefList items={company.techStack.slice(0, 5)} />
        </BriefSection>
      )}

      {company.cultureValues.length > 0 && (
        <BriefSection title="Culture">
          <p className="hermes-company-brief__inline">
            {company.cultureValues.slice(0, 5).join(" · ")}
          </p>
        </BriefSection>
      )}

      {company.internRelevance && (
        <BriefSection title="Why this company for you">
          <p className="hermes-company-brief__inline">{company.internRelevance}</p>
        </BriefSection>
      )}

      {role && (
        <BriefSection title={`Role context: ${role.roleTitle}`}>
          <p className="hermes-company-brief__inline">{role.summary}</p>
          {role.skillsToEmphasize.length > 0 && (
            <p className="hermes-company-brief__meta">
              Emphasize: {role.skillsToEmphasize.join(", ")}
            </p>
          )}
          {role.talkingPoints.length > 0 && (
            <>
              <p className="hermes-company-brief__meta" style={{ marginTop: "0.5rem" }}>
                Talking points
              </p>
              <BriefList items={role.talkingPoints.slice(0, 4)} />
            </>
          )}
        </BriefSection>
      )}

      {guidance && guidance.messageAngles.length > 0 && (
        <BriefSection title="Message angles">
          <BriefList items={guidance.messageAngles} />
        </BriefSection>
      )}

      <p className="hermes-company-brief__footer">
        {resultCount} contact{resultCount === 1 ? "" : "s"} in this pin
      </p>
    </div>
  );
}
