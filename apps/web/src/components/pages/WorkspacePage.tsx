/** Main workspace: section-specific center panel + ResultsPanel right column. */
import { useEffect } from "react";
import { ResizableSplit } from "../layout/ResizableSplit";
import { ChatInterface } from "../chat/ChatInterface";
import { FinderWorkspace } from "../finder/FinderWorkspace";
import { FollowupsWorkspace } from "../followups/FollowupsWorkspace";
import { ProfileCoachInterface } from "../profile/ProfileCoachInterface";
import { ResultsPanel } from "../results/ResultsPanel";
import { SECTION_CONFIG } from "../../lib/sectionConfig";
import { useHermesStore } from "../../stores/hermesStore";
import { useSessionStore } from "../../stores/sessionStore";

export function WorkspacePage() {
  const selectedTargets = useHermesStore((s) => s.selectedTargets);
  const sidebarSection = useHermesStore((s) => s.sidebarSection);
  const config = SECTION_CONFIG[sidebarSection];
  const ensureInitialized = useSessionStore((s) => s.ensureInitialized);
  const activeId = useSessionStore((s) => s.activeId);
  const activeSession = useSessionStore((s) =>
    s.sessions.find((sess) => sess.id === s.activeId)
  );

  useEffect(() => {
    ensureInitialized();
  }, [ensureInitialized]);

  const brief = config.workspaceBrief({
    searchTitle: activeSession?.searchTitle,
    selectedCount: selectedTargets.length,
  });

  const centerPanel = (() => {
    switch (sidebarSection) {
      case "profile":
        return <ProfileCoachInterface />;
      case "finder":
        return <FinderWorkspace />;
      case "followups":
        return <FollowupsWorkspace />;
      case "chat":
        if (activeId && activeSession) {
          return (
            <ChatInterface
              key={activeId}
              sessionId={activeId}
              initialMessages={activeSession.messages}
              searchTitle={activeSession.searchTitle}
              outreachContext={activeSession.outreachContext}
            />
          );
        }
        return (
          <div
            className="vl-tile flex items-center justify-center h-full text-sm"
            style={{ color: "var(--vl-muted)" }}
          >
            Loading…
          </div>
        );
      default:
        return null;
    }
  })();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div
        className={
          sidebarSection === "finder"
            ? "vl-project-header vl-project-header--compact"
            : "vl-project-header"
        }
      >
        <div className="vl-project-header__row">
          <h2 className="vl-project-header__title">{config.workspaceTitle}</h2>
          {sidebarSection !== "finder" && (
            <span className="vl-project-header__region">{config.workspaceRegion}</span>
          )}
        </div>
        {sidebarSection !== "finder" && (
          <div className="vl-project-header__brief">{brief}</div>
        )}
      </div>

      <ResizableSplit
        storageKey="split:hermes-workspace"
        left={centerPanel}
        right={<ResultsPanel />}
        defaultLeftPct={48}
      />
    </div>
  );
}
