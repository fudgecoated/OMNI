import type { ReactNode } from "react";
import type { ApplicantProject } from "@hermes/shared";
import { useProfileStore } from "../../stores/profileStore";

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="hermes-profile-field">
      <span className="hermes-profile-field__label">{label}</span>
      {children}
    </label>
  );
}

function ProjectEditor({
  project,
  index,
  onChange,
  onRemove,
  readOnly,
}: {
  project: ApplicantProject;
  index: number;
  onChange: (p: ApplicantProject) => void;
  onRemove: () => void;
  readOnly: boolean;
}) {
  return (
    <div className="hermes-profile-project">
      <div className="hermes-profile-project__head">
        <span>Project {index + 1}</span>
        {!readOnly && (
          <button type="button" className="vl-chip" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
      <input
        className="hermes-profile-input"
        placeholder="Project name"
        value={project.name}
        readOnly={readOnly}
        onChange={(e) => onChange({ ...project, name: e.target.value })}
      />
      <textarea
        className="hermes-profile-textarea"
        placeholder="What you built and impact"
        rows={2}
        value={project.description}
        readOnly={readOnly}
        onChange={(e) => onChange({ ...project, description: e.target.value })}
      />
      <div className="hermes-profile-project__row">
        <input
          className="hermes-profile-input"
          placeholder="Tech (comma-separated)"
          value={project.tech.join(", ")}
          readOnly={readOnly}
          onChange={(e) => onChange({ ...project, tech: parseList(e.target.value) })}
        />
        <input
          className="hermes-profile-input"
          placeholder="Link"
          value={project.link ?? ""}
          readOnly={readOnly}
          onChange={(e) => onChange({ ...project, link: e.target.value })}
        />
      </div>
      <input
        className="hermes-profile-input"
        placeholder="What's innovative / noteworthy?"
        value={project.highlight ?? ""}
        readOnly={readOnly}
        onChange={(e) => onChange({ ...project, highlight: e.target.value })}
      />
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="hermes-profile-card">
      <div className="hermes-profile-card__head">
        <h3 className="hermes-profile-card__title">{title}</h3>
        {description && <p className="hermes-profile-card__desc">{description}</p>}
      </div>
      <div className="hermes-profile-card__body">{children}</div>
    </section>
  );
}

export function ProfilePanel() {
  const isEditing = useProfileStore((s) => s.isEditing);
  const profile = useProfileStore((s) => s.profile);
  const draftProfile = useProfileStore((s) => s.draftProfile);
  const patchDraft = useProfileStore((s) => s.patchDraft);
  const addProject = useProfileStore((s) => s.addProject);
  const updateProject = useProfileStore((s) => s.updateProject);
  const removeProject = useProfileStore((s) => s.removeProject);

  const display = isEditing && draftProfile ? draftProfile : profile;
  const readOnly = !isEditing;

  return (
    <div className="hermes-profile-panel">
      <SectionCard title="Who you are" description="Basics Hermes uses in every outreach thread.">
        <div className="hermes-profile-grid hermes-profile-grid--2">
          <Field label="Full name">
            <input
              className="hermes-profile-input"
              value={display.name}
              readOnly={readOnly}
              onChange={(e) => patchDraft({ name: e.target.value })}
            />
          </Field>
          <Field label="School">
            <input
              className="hermes-profile-input"
              value={display.school}
              readOnly={readOnly}
              onChange={(e) => patchDraft({ school: e.target.value })}
            />
          </Field>
          <Field label="Year">
            <input
              className="hermes-profile-input"
              value={display.year}
              readOnly={readOnly}
              onChange={(e) => patchDraft({ year: e.target.value })}
            />
          </Field>
          <Field label="Location">
            <input
              className="hermes-profile-input"
              value={display.location}
              readOnly={readOnly}
              onChange={(e) => patchDraft({ location: e.target.value })}
            />
          </Field>
        </div>
        <Field label="GitHub">
          <input
            className="hermes-profile-input"
            value={display.githubUrl}
            readOnly={readOnly}
            onChange={(e) => patchDraft({ githubUrl: e.target.value })}
          />
        </Field>
        <Field label="LinkedIn (optional)">
          <input
            className="hermes-profile-input"
            value={display.linkedinUrl ?? ""}
            readOnly={readOnly}
            onChange={(e) => patchDraft({ linkedinUrl: e.target.value })}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Job search" description="What you're looking for and why.">
        <Field label="Target role">
          <input
            className="hermes-profile-input"
            value={display.targetRole}
            readOnly={readOnly}
            onChange={(e) => patchDraft({ targetRole: e.target.value })}
          />
        </Field>
        <Field label="Why you're looking now">
          <textarea
            className="hermes-profile-textarea"
            rows={3}
            value={display.jobSearchWhy}
            readOnly={readOnly}
            onChange={(e) => patchDraft({ jobSearchWhy: e.target.value })}
          />
        </Field>
        <Field label="Career goals (optional)">
          <textarea
            className="hermes-profile-textarea"
            rows={2}
            value={display.careerGoals ?? ""}
            readOnly={readOnly}
            onChange={(e) => patchDraft({ careerGoals: e.target.value })}
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Skills & learning"
        description="Be honest — Hermes won't claim skills you list as off-limits."
      >
        <Field label="Can demonstrate">
          <textarea
            className="hermes-profile-textarea"
            rows={2}
            placeholder="Comma-separated"
            value={display.skillsCanDo.join(", ")}
            readOnly={readOnly}
            onChange={(e) => patchDraft({ skillsCanDo: parseList(e.target.value) })}
          />
        </Field>
        <Field label="Currently learning">
          <textarea
            className="hermes-profile-textarea"
            rows={2}
            placeholder="Comma-separated"
            value={display.skillsLearning.join(", ")}
            readOnly={readOnly}
            onChange={(e) => patchDraft({ skillsLearning: parseList(e.target.value) })}
          />
        </Field>
        <Field label="Do not claim">
          <textarea
            className="hermes-profile-textarea"
            rows={2}
            placeholder="Weak areas, honesty"
            value={display.skillsAvoid.join(", ")}
            readOnly={readOnly}
            onChange={(e) => patchDraft({ skillsAvoid: parseList(e.target.value) })}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Projects & innovation">
        {display.projects.map((p, i) => (
          <ProjectEditor
            key={i}
            project={p}
            index={i}
            readOnly={readOnly}
            onChange={(proj) => updateProject(i, proj)}
            onRemove={() => removeProject(i)}
          />
        ))}
        {!readOnly && (
          <button type="button" className="vl-chip" onClick={addProject}>
            + Add project
          </button>
        )}
        <Field label="Side experiments / innovative work">
          <textarea
            className="hermes-profile-textarea"
            rows={2}
            value={display.innovativeWork ?? ""}
            readOnly={readOnly}
            onChange={(e) => patchDraft({ innovativeWork: e.target.value })}
          />
        </Field>
      </SectionCard>

      {readOnly && (
        <p className="hermes-profile-readonly-hint">
          Click <strong>Modify</strong> to edit, or use <strong>Import with Hermes</strong> / Profile
          Coach on the left.
        </p>
      )}
    </div>
  );
}
