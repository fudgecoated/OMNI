import type { ApplicantContext } from "@hermes/shared";
import { profileCompleteness } from "@hermes/shared";
import { useProfileStore } from "../../stores/profileStore";

export function ApplicantUnderstandingCard({
  applicant,
  compact,
}: {
  applicant?: ApplicantContext;
  compact?: boolean;
}) {
  const profile = useProfileStore((s) => s.profile);
  const { percent, missing } = profileCompleteness(profile);

  if (!applicant && percent < 40) {
    return (
      <div className="hermes-understanding hermes-understanding--empty">
        <p className="hermes-understanding__title">Hermes doesn&apos;t know you yet</p>
        <p className="hermes-understanding__text">
          Fill in <strong>My Profile</strong> so outreach can mention your projects, goals,
          and what you&apos;re learning — not generic filler.
        </p>
        {missing.length > 0 && (
          <p className="hermes-understanding__missing">Still needed: {missing.join(", ")}</p>
        )}
      </div>
    );
  }

  const a = applicant;
  if (!a) {
    return (
      <div className="hermes-understanding">
        <p className="hermes-understanding__title">Profile {percent}% complete</p>
        <p className="hermes-understanding__text">Run a search to refresh AI context.</p>
      </div>
    );
  }

  return (
    <div className={`hermes-understanding ${compact ? "hermes-understanding--compact" : ""}`}>
      <div className="hermes-understanding__header">
        <span className="hermes-understanding__title">What Hermes knows about you</span>
        <span className="hermes-understanding__badge">{percent}% profile</span>
      </div>
      <p className="hermes-understanding__summary">{a.whoTheyAre}</p>
      {!compact && (
        <dl className="hermes-understanding__dl">
          <div>
            <dt>Looking for</dt>
            <dd>{a.targetRole}</dd>
          </div>
          <div>
            <dt>Why</dt>
            <dd>{a.jobSearchWhy}</dd>
          </div>
          {a.skillsCanDo.length > 0 && (
            <div>
              <dt>Can do</dt>
              <dd>{a.skillsCanDo.join(", ")}</dd>
            </div>
          )}
          {a.skillsLearning.length > 0 && (
            <div>
              <dt>Learning</dt>
              <dd>{a.skillsLearning.join(", ")}</dd>
            </div>
          )}
          {a.projects.length > 0 && (
            <div>
              <dt>Projects</dt>
              <dd>
                {a.projects.map((p) => p.name).filter(Boolean).join(" · ") ||
                  `${a.projects.length} listed`}
              </dd>
            </div>
          )}
          {a.innovativeWork && (
            <div>
              <dt>Innovating on</dt>
              <dd>{a.innovativeWork}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}
