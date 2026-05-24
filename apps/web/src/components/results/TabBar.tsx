interface Tab {
  id: string;
  label: string;
}

interface Props {
  activeTab: string;
  onTabChange: (id: string) => void;
  tabs: Tab[];
}

export function TabBar({ activeTab, onTabChange, tabs }: Props) {
  return (
    <div role="tablist" className="flex gap-3 px-5 pt-4 pb-2">
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(tab.id)}
            className="text-sm font-semibold"
            style={{
              background: "none",
              border: "none",
              padding: "0 0 6px",
              cursor: "pointer",
              color: active ? "var(--vl-accent)" : "var(--vl-muted)",
              borderBottom: active ? "2px solid var(--vl-accent)" : "2px solid transparent",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
