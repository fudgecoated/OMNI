import type { OutreachContext } from "@hermes/shared";

export function CompanyContextCard({ context }: { context?: OutreachContext }) {
  const company = context?.company;
  if (!company?.summary) return null;

  return (
    <div className="hermes-company-context">
      <div className="hermes-company-context__title">Company brief</div>
      <p className="hermes-company-context__summary">{company.summary}</p>
      {company.hiringSignals.length > 0 && (
        <p className="hermes-company-context__meta">
          Hiring: {company.hiringSignals.slice(0, 2).join(" · ")}
        </p>
      )}
    </div>
  );
}
