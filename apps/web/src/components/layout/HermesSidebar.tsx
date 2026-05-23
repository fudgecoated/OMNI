import { useHermesStore, type SidebarSection } from "../../stores/hermesStore";
import { FinderPanel } from "../finder/FinderPanel";

const NAV: { id: SidebarSection; icon: string; label: string }[] = [
  { id: "chat", icon: "💬", label: "Outreach Chat" },
  { id: "finder", icon: "🔍", label: "People Finder" },
  { id: "followups", icon: "⏰", label: "Follow-ups" },
];

export function HermesSidebar() {
  const sidebarSection = useHermesStore((s) => s.sidebarSection);
  const setSidebarSection = useHermesStore((s) => s.setSidebarSection);
  const setResultsTab = useHermesStore((s) => s.setResultsTab);
  const dueCount = 0; // badge optional — TrackerResult loads async

  const onNav = (id: SidebarSection) => {
    setSidebarSection(id);
    if (id === "followups") setResultsTab("followups");
    if (id === "finder") setResultsTab("person");
  };

  return (
    <aside className="vl-menu" aria-label="Hermes navigation">
      <div className="vl-menu__header">Hermes</div>

      <div className="vl-menu__scroll" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`vl-menu__item ${sidebarSection === item.id ? "vl-menu__item--active" : ""}`}
            onClick={() => onNav(item.id)}
          >
            <span className="vl-menu__item-icon" aria-hidden>
              {item.icon}
            </span>
            <span className="vl-menu__item-label">{item.label}</span>
            {item.id === "followups" && dueCount > 0 && (
              <span className="vl-menu__item-meta">{dueCount}</span>
            )}
          </button>
        ))}

        <div className="vl-menu__section-label" style={{ marginTop: "0.5rem" }}>
          <span>Lookup</span>
        </div>
        <FinderPanel />
      </div>

      <div className="vl-menu__profile" style={{ padding: "0.75rem 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="vl-menu__avatar">UC</span>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>UCalgary SWE</div>
            <div style={{ fontSize: "0.7rem", color: "var(--vl-menu-muted)" }}>
              Hackathon MVP
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
