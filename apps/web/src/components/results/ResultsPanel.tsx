import { useEffect } from "react";
import { useHermesStore, type ResultsTab } from "../../stores/hermesStore";
import {
  defaultTabForSection,
  isTabAllowedInSection,
  tabsForSection,
} from "../../lib/sectionConfig";
import { TabBar } from "./TabBar";
import { MessageResult } from "./MessageResult";
import { PersonResult } from "./PersonResult";
import { FollowupsPanel } from "../followups/FollowupsPanel";
import { ProfileWorkspace } from "../profile/ProfileWorkspace";
import { CompanyResult } from "./CompanyResult";

export function ResultsPanel() {
  const resultsTab = useHermesStore((s) => s.resultsTab);
  const setResultsTab = useHermesStore((s) => s.setResultsTab);
  const sidebarSection = useHermesStore((s) => s.sidebarSection);

  const tabs = tabsForSection(sidebarSection);
  const showTabBar = tabs.length > 1;

  useEffect(() => {
    if (!isTabAllowedInSection(resultsTab, sidebarSection)) {
      setResultsTab(defaultTabForSection(sidebarSection));
    }
  }, [sidebarSection, resultsTab, setResultsTab]);

  const activeTab = isTabAllowedInSection(resultsTab, sidebarSection)
    ? resultsTab
    : defaultTabForSection(sidebarSection);

  return (
    <div className="hermes-results-panel flex flex-col h-full overflow-hidden">
      {showTabBar && (
        <TabBar
          activeTab={activeTab}
          onTabChange={(id) => setResultsTab(id as ResultsTab)}
          tabs={tabs}
        />
      )}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "profile" && <ProfileWorkspace />}
        {activeTab === "company" && <CompanyResult />}
        {activeTab === "selected" && <PersonResult variant="finder" />}
        {activeTab === "message" && <MessageResult />}
        {activeTab === "person" && <PersonResult variant="chat" />}
        {activeTab === "followups" && <FollowupsPanel />}
      </div>
    </div>
  );
}
