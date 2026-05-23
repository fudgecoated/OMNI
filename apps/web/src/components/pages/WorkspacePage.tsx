import { ResizableSplit } from "../layout/ResizableSplit";
import { ChatInterface } from "../chat/ChatInterface";
import { ResultsPanel } from "../results/ResultsPanel";
import { useHermesStore } from "../../stores/hermesStore";

export function WorkspacePage() {
  const selectedPerson = useHermesStore((s) => s.selectedPerson);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div className="vl-project-header">
        <div className="vl-project-header__row">
          <h2 className="vl-project-header__title">Hermes Workspace</h2>
          <span className="vl-project-header__region">Calgary SWE → Big Tech</span>
        </div>
        <div
          className={`vl-project-header__brief ${!selectedPerson ? "vl-project-header__brief--placeholder" : ""}`}
        >
          {selectedPerson
            ? `Outreach target: ${selectedPerson.name} (${selectedPerson.team})`
            : "Find people on the left, chat in the center, review drafts on the right."}
        </div>
      </div>

      <ResizableSplit
        storageKey="split:hermes-workspace"
        left={<ChatInterface />}
        right={<ResultsPanel />}
        defaultLeftPct={48}
      />
    </div>
  );
}
