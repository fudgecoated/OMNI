import { useMemo, useState } from "react";
import { profileCompleteness } from "@hermes/shared";
import { useProfileStore } from "../../stores/profileStore";
import { ProfilePanel } from "./ProfilePanel";
import { ProfileSources } from "./ProfileSources";
import { ProfileContextMarkdown } from "./ProfileContextMarkdown";

type ProfileTab = "details" | "context";

export function ProfileWorkspace() {
  const [tab, setTab] = useState<ProfileTab>("details");
  const isEditing = useProfileStore((s) => s.isEditing);
  const startEditing = useProfileStore((s) => s.startEditing);
  const cancelEditing = useProfileStore((s) => s.cancelEditing);
  const saveEditing = useProfileStore((s) => s.saveEditing);
  const profile = useProfileStore((s) => s.profile);
  const { percent, missing } = useMemo(() => profileCompleteness(profile), [profile]);

  return (
    <div className="hermes-profile-workspace">
      <header className="hermes-profile-workspace__header">
        <div className="hermes-profile-workspace__header-main">
          <h2 className="hermes-profile-workspace__title">Profile</h2>
          <p className="hermes-profile-workspace__subtitle">
            Form fields and Context markdown stay in sync. Save to persist across sessions.
          </p>
          <div className="hermes-profile-workspace__progress">
            <div className="hermes-profile-progress__bar" style={{ width: `${percent}%` }} />
            <span className="hermes-profile-workspace__progress-label">
              {percent}% complete{isEditing ? " | editing" : ""}
            </span>
          </div>
          {missing.length > 0 && (
            <p className="hermes-understanding__missing">Still needed: {missing.join(" | ")}</p>
          )}
        </div>
        <div className="hermes-profile-workspace__actions">
          {!isEditing ? (
            <button type="button" className="vl-btn" onClick={startEditing}>
              Modify
            </button>
          ) : (
            <>
              <button type="button" className="vl-btn" onClick={cancelEditing}>
                Cancel
              </button>
              <button type="button" className="vl-btn vl-btn--primary" onClick={saveEditing}>
                Save
              </button>
            </>
          )}
        </div>
      </header>

      <div className="hermes-profile-workspace__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "details"}
          className={`hermes-profile-workspace__tab ${tab === "details" ? "hermes-profile-workspace__tab--active" : ""}`}
          onClick={() => setTab("details")}
        >
          Details
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "context"}
          className={`hermes-profile-workspace__tab ${tab === "context" ? "hermes-profile-workspace__tab--active" : ""}`}
          onClick={() => setTab("context")}
        >
          Context (Markdown)
        </button>
      </div>

      <div className="hermes-profile-workspace__body">
        {tab === "details" ? (
          <>
            <ProfileSources />
            <ProfilePanel />
          </>
        ) : (
          <ProfileContextMarkdown />
        )}
      </div>
    </div>
  );
}
