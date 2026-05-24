import { useFinder } from "../../hooks/useFinder";
import { useSessionStore } from "../../stores/sessionStore";
import { ChatInterface } from "../chat/ChatInterface";
import { FinderSearchForm } from "./FinderSearchForm";
import { FinderCoachToolbar } from "./FinderCoachToolbar";
import type { UIMessage } from "ai";

const FINDER_WELCOME: UIMessage = {
  id: "finder-welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Contacts are loaded on the **Selected** tab (all selected by default). Ask who to prioritize, how they fit your profile, or what to mention — then open **Outreach Chat** to draft messages.",
    },
  ],
};

export function FinderWorkspace() {
  const { searchedAt, hasResults, activeId, activeSession, error, resetSearch } = useFinder();
  const createSession = useSessionStore((s) => s.createSession);

  if (!activeId || !activeSession) {
    return (
      <div
        className="vl-tile flex items-center justify-center h-full text-sm"
        style={{ color: "var(--vl-muted)" }}
      >
        <button type="button" className="vl-btn" onClick={() => createSession()}>
          Start a search pin
        </button>
      </div>
    );
  }

  if (hasResults) {
    const finderMessages =
      activeSession.finderMessages?.length > 0
        ? activeSession.finderMessages
        : [FINDER_WELCOME];

    return (
      <div className="vl-tile flex flex-col h-full overflow-hidden hermes-finder-workspace hermes-finder-workspace--chat-only">
        <FinderCoachToolbar />
        <div className="hermes-finder-workspace__chat hermes-finder-workspace__chat--full">
          <ChatInterface
            key={`finder-${activeId}`}
            sessionId={activeId}
            initialMessages={finderMessages}
            searchTitle={activeSession.searchTitle}
            outreachContext={activeSession.outreachContext}
            variant="finder"
            hideFinderChrome
          />
        </div>
      </div>
    );
  }

  if (searchedAt) {
    return (
      <div className="vl-tile flex flex-col h-full overflow-hidden hermes-finder-empty">
        <div className="hermes-finder-empty__body">
          <h2 className="hermes-finder-empty__title">{activeSession.searchTitle}</h2>
          <p className="hermes-finder-empty__text">
            {error ??
              "No contacts matched this search. Try a broader role, different spelling, or confirm your API key is set."}
          </p>
          {activeSession.outreachContext?.company?.summary && (
            <p className="hermes-finder-empty__hint">
              Company research is on the right — adjust the search to find people.
            </p>
          )}
          <button type="button" className="vl-btn vl-btn--primary" onClick={resetSearch}>
            Adjust search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vl-tile flex flex-col h-full overflow-hidden">
      <FinderSearchForm />
    </div>
  );
}
