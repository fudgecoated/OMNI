import { useEffect } from "react";
import { useHermesStore, type ResultsTab } from "../../stores/hermesStore";
import { TabBar } from "./TabBar";
import { MessageResult } from "./MessageResult";
import { PersonResult } from "./PersonResult";
import { TrackerResult } from "./TrackerResult";

const TABS = [
  { id: "message" as const, label: "Message" },
  { id: "person" as const, label: "Person" },
  { id: "followups" as const, label: "Follow-ups" },
];

export function ResultsPanel() {
  const resultsTab = useHermesStore((s) => s.resultsTab);
  const setResultsTab = useHermesStore((s) => s.setResultsTab);
  const sidebarSection = useHermesStore((s) => s.sidebarSection);

  useEffect(() => {
    if (sidebarSection === "followups") setResultsTab("followups");
  }, [sidebarSection, setResultsTab]);

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: "var(--vl-bg)" }}
    >
      <TabBar
        activeTab={resultsTab}
        onTabChange={(id) => setResultsTab(id as ResultsTab)}
        tabs={TABS}
      />
      <div className="flex-1 min-h-0 overflow-hidden">
        {resultsTab === "message" && <MessageResult />}
        {resultsTab === "person" && <PersonResult />}
        {resultsTab === "followups" && <TrackerResult />}
      </div>
    </div>
  );
}
