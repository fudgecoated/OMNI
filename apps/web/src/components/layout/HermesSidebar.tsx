import { useHermesStore, type SidebarSection } from "../../stores/hermesStore";
import { FinderPanel } from "../finder/FinderPanel";
import { SessionList } from "../session/SessionList";
import { SidebarSectionPanel } from "./SidebarSectionPanel";
import { profileCompleteness } from "@hermes/shared";
import { useProfileStore } from "../../stores/profileStore";
import { SECTION_CONFIG } from "../../lib/sectionConfig";

const NAV: SidebarSection[] = ["profile", "finder", "chat", "followups"];

export function HermesSidebar() {
  const sidebarSection = useHermesStore((s) => s.sidebarSection);
  const setSidebarSection = useHermesStore((s) => s.setSidebarSection);
  const selectedCount = useHermesStore((s) => s.selectedTargets.length);
  const profileName = useProfileStore((s) => s.profile.name);
  const profilePercent = useProfileStore((s) => profileCompleteness(s.profile).percent);
  const dueCount = 0;
  const panel = SECTION_CONFIG[sidebarSection];

  return (
    <aside className="vl-menu" aria-label="Hermes navigation">
      <div className="vl-menu__header">Hermes</div>

      <div className="vl-menu__scroll hermes-sidebar-nav">
        {NAV.map((id) => {
          const item = SECTION_CONFIG[id];
          const icons: Record<SidebarSection, string> = {
            profile: "👤",
            finder: "🔍",
            chat: "💬",
            followups: "⏰",
          };
          return (
            <button
              key={id}
              type="button"
              className={`vl-menu__item ${sidebarSection === id ? "vl-menu__item--active" : ""}`}
              onClick={() => setSidebarSection(id)}
            >
              <span className="vl-menu__item-icon" aria-hidden>
                {icons[id]}
              </span>
              <span className="vl-menu__item-label">{item.navLabel}</span>
              {id === "profile" && profilePercent < 100 && (
                <span className="vl-menu__item-meta">{profilePercent}%</span>
              )}
              {id === "finder" && selectedCount > 0 && (
                <span className="vl-menu__item-meta">{selectedCount}</span>
              )}
              {id === "followups" && dueCount > 0 && (
                <span className="vl-menu__item-meta">{dueCount}</span>
              )}
            </button>
          );
        })}

        {sidebarSection === "profile" && (
          <p className="hermes-sidebar-hint">
            Profile Coach is in the center. Form and markdown are on the right.
          </p>
        )}

        {sidebarSection === "finder" && (
          <SidebarSectionPanel
            title={panel.sidebarPanelTitle!}
            description={panel.sidebarPanelDescription}
          >
            <FinderPanel />
          </SidebarSectionPanel>
        )}

        {sidebarSection === "chat" && (
          <SidebarSectionPanel
            title={panel.sidebarPanelTitle!}
            description={panel.sidebarPanelDescription}
          >
            <SessionList variant="chat" />
          </SidebarSectionPanel>
        )}

        {sidebarSection === "followups" && (
          <p className="hermes-sidebar-hint">{panel.sidebarPanelDescription}</p>
        )}
      </div>

      <div className="vl-menu__profile" style={{ padding: "0.75rem 1rem" }}>
        <button
          type="button"
          className="hermes-profile-footer"
          onClick={() => setSidebarSection("profile")}
        >
          <span className="vl-menu__avatar">
            {profileName.slice(0, 2).toUpperCase() || "?"}
          </span>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>
              {profileName || "Complete profile"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--vl-menu-muted)" }}>
              {profilePercent}% · profile context
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}
