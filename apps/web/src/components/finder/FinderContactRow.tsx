import type { OutreachTarget } from "@hermes/shared";

export function FinderContactRow({
  person,
  selected,
  onToggle,
}: {
  person: OutreachTarget;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={`hermes-finder-person hermes-finder-person--selectable ${selected ? "hermes-finder-person--active" : ""}`}
    >
      <input
        type="checkbox"
        className="hermes-finder-person__check"
        checked={selected}
        onChange={onToggle}
        aria-label={`Select ${person.name}`}
      />
      <div className="hermes-finder-person__body">
        <div className="hermes-finder-person__name">{person.name}</div>
        <div className="hermes-finder-person__meta">
          {person.role}
          {person.team ? ` · ${person.team}` : ""}
          {person.relevanceScore != null ? ` · ${person.relevanceScore}` : ""}
        </div>
      </div>
    </label>
  );
}
