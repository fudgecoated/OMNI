import type { OutreachTarget } from "@hermes/shared";

export function FinderContactRow({
  person,
  selected,
  onToggle,
  onDraft,
}: {
  person: OutreachTarget;
  selected: boolean;
  onToggle: () => void;
  onDraft?: () => void;
}) {
  const score = person.relevanceScore ?? 0;
  const tier = score >= 90 ? "strong" : score >= 80 ? "good" : "adjacent";
  const scoreClass = `hermes-score--${tier}`;
  const tierClass = `hermes-tier--${tier}`;
  const initials =
    person.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";
  const why =
    person.evidence ??
    (person.schoolConnection
      ? `${person.schoolConnection} plus ${person.team || person.role} makes this a warm first outreach.`
      : `${person.role} on ${person.team || "a relevant team"} is a strong adjacent signal for this role.`);

  return (
    <article
      className={`hermes-finder-person hermes-finder-person--selectable ${tierClass} ${
        selected ? "hermes-finder-person--active" : ""
      }`}
    >
      <div className="hermes-finder-person__avatar" aria-hidden="true">
        {initials}
      </div>

      <div className="hermes-finder-person__body">
        <div className="hermes-finder-person__intro">
          <div className="hermes-finder-person__name">{person.name}</div>
          <div className="hermes-finder-person__meta">
            {person.role}
            {person.team ? ` - ${person.team}` : ""}
            {person.company ? ` - ${person.company}` : ""}
          </div>

          <p className="hermes-finder-person__why">
            <strong>Why this person:</strong> {why}
          </p>

          {person.schoolConnection && (
            <div className="hermes-finder-person__school">{person.schoolConnection}</div>
          )}
        </div>

        <div className="hermes-finder-person__signals">
          {person.relevanceScore != null && (
            <span className={`hermes-score ${scoreClass}`}>
              {person.relevanceScore} match
            </span>
          )}
          <button
            type="button"
            className={`hermes-finder-person__select-toggle ${
              selected ? "hermes-finder-person__select-toggle--active" : ""
            }`}
            aria-pressed={selected}
            onClick={onToggle}
          >
            {selected ? "Selected" : "Add"}
          </button>
        </div>

        <div
          className="hermes-finder-person__action-bar"
          role="group"
          aria-label={`Actions for ${person.name}`}
        >
          <a
            href={person.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="vl-chip hermes-finder-person__action-link"
          >
            LinkedIn
          </a>
          {person.email && (
            <a href={`mailto:${person.email}`} className="vl-chip hermes-finder-person__action-link">
              Email
            </a>
          )}
          {onDraft && (
            <button
              type="button"
              className="vl-btn vl-btn--primary hermes-finder-person__action-draft"
              onClick={onDraft}
            >
              Draft message
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
