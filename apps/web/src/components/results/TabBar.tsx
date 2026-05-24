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
    <div role="tablist" className="hermes-tab-bar flex gap-3 px-5 pt-4 pb-2">
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(tab.id)}
            className={`text-sm font-semibold hermes-tab-bar__button ${
              active ? "hermes-tab-bar__button--active" : ""
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
