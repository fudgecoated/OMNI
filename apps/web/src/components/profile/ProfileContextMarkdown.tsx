import { useLiveContextMarkdown, useProfileStore } from "../../stores/profileStore";

export function ProfileContextMarkdown() {
  const markdown = useLiveContextMarkdown();
  const isEditing = useProfileStore((s) => s.isEditing);

  const copy = () => {
    void navigator.clipboard.writeText(markdown);
  };

  return (
    <div className="hermes-profile-markdown-pane">
      <div className="hermes-profile-markdown-pane__toolbar">
        <p className="hermes-profile-card__desc" style={{ margin: 0 }}>
          Live markdown from your profile. Used by People Finder, Outreach Chat, and message
          drafts{isEditing ? " — updates as you type" : ""}.
        </p>
        <div className="hermes-profile-markdown-pane__actions">
          <button type="button" className="vl-btn vl-btn--primary" onClick={copy}>
            Copy
          </button>
        </div>
      </div>
      <pre className="hermes-profile-markdown-preview">{markdown}</pre>
    </div>
  );
}
