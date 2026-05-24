/**
 * Shared chat surface for two different mental tasks:
 * finder mode helps decide who to contact, while outreach mode helps write the message.
 * Keeping both modes on the same pin preserves company/contact/applicant context.
 */
import { useCallback, useEffect } from "react";
import type { UIMessage } from "ai";
import type { OutreachContext } from "@hermes/shared";
import { useHermesStore } from "../../stores/hermesStore";
import { useProfileStore } from "../../stores/profileStore";
import { useSessionStore } from "../../stores/sessionStore";
import {
  useHermesChat,
  WELCOME_MESSAGE,
  WELCOME_SUGGESTIONS,
  FINDER_CHAT_SUGGESTIONS,
} from "../../hooks/useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SECTION_CONFIG } from "../../lib/sectionConfig";

interface Props {
  sessionId: string;
  initialMessages: UIMessage[];
  searchTitle: string;
  outreachContext?: OutreachContext;
  variant?: "outreach" | "finder";
}

function ChatGlyph() {
  return (
    <svg
      aria-hidden
      width="100"
      height="100"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 36c0-7.732 6.268-14 14-14h48c7.732 0 14 6.268 14 14v32c0 7.732-6.268 14-14 14H58l-16 14v-14h-6c-7.732 0-14-6.268-14-14V36z"
        stroke="#d4cec6"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}

export function ChatInterface({
  sessionId,
  initialMessages,
  searchTitle,
  outreachContext,
  variant = "outreach",
}: Props) {
  const isFinder = variant === "finder";
  const config = isFinder ? SECTION_CONFIG.finder : SECTION_CONFIG.chat;
  const student = useProfileStore((s) => s.profile);
  const selectedTargets = useHermesStore((s) => s.selectedTargets);
  const setSidebarSection = useHermesStore((s) => s.setSidebarSection);
  const setResultsTab = useHermesStore((s) => s.setResultsTab);
  const updateSession = useSessionStore((s) => s.updateSession);
  const createSession = useSessionStore((s) => s.createSession);
  const pinSession = useSessionStore((s) => s.sessions.find((sess) => sess.id === sessionId));
  const peopleCount = pinSession?.results.length ?? 0;

  const onPersist = useCallback(
    (messages: UIMessage[]) => {
      const targets = useHermesStore.getState().selectedTargets;
      if (isFinder) {
        updateSession(sessionId, { finderMessages: messages, selectedTargets: targets });
      } else {
        updateSession(sessionId, { messages, selectedTargets: targets });
      }
    },
    [sessionId, updateSession, isFinder]
  );

  useEffect(() => {
    updateSession(sessionId, { selectedTargets });
  }, [sessionId, selectedTargets, updateSession]);

  const { uiMessages, isLoading, error, send } = useHermesChat({
    chatId: isFinder ? `finder-${sessionId}` : sessionId,
    initialMessages,
    student,
    selectedTargets,
    outreachContext,
    onPersist,
  });

  const defaultWelcome = isFinder
    ? (initialMessages[0] ?? WELCOME_MESSAGE)
    : WELCOME_MESSAGE;
  const messages: UIMessage[] =
    uiMessages.length === 0 ? [defaultWelcome] : uiMessages;
  const showWelcome = uiMessages.length === 0 && !isFinder;
  const showFinderSuggestions =
    isFinder && uiMessages.length <= 1 && !isLoading;
  const suggestions = isFinder ? FINDER_CHAT_SUGGESTIONS : WELCOME_SUGGESTIONS;
  const lastIsUser =
    uiMessages.length > 0 && uiMessages[uiMessages.length - 1]?.role === "user";

  const targetSummary =
    selectedTargets.length === 0
      ? "No contacts selected"
      : selectedTargets.length === 1
        ? `${selectedTargets[0].name} at ${selectedTargets[0].company}`
        : `${selectedTargets.length} contacts selected`;

  const finderSelectionSummary =
    peopleCount === 0
      ? "No contacts loaded"
      : `${selectedTargets.length} of ${peopleCount} contacts selected`;

  const handleNewChat = () => {
    createSession();
    useHermesStore.getState().setSelectedTargets([]);
  };

  return (
    <div
      data-testid="chat-interface"
      className={
        isFinder
          ? "flex flex-col flex-1 min-h-0 h-full overflow-hidden"
          : "vl-tile flex flex-col h-full overflow-hidden"
      }
    >
      <header className="hermes-panel-header hermes-panel-header--row">
        <div>
          <h1 className="hermes-panel-header__title">{config.centerTitle}</h1>
          <p className="hermes-panel-header__subtitle">
            <span className="session-pin-label">{searchTitle}</span>
            {" · "}
            {isFinder ? finderSelectionSummary : targetSummary}
            {" · "}
            {config.centerSubtitle}
            {!isFinder && selectedTargets.length === 0 && (
              <>
                {" · "}
                <button
                  type="button"
                  className="hermes-inline-link"
                  onClick={() => setSidebarSection("finder")}
                >
                  People Finder
                </button>
              </>
            )}
          </p>
        </div>
        {isFinder ? (
          peopleCount > 0 && (
            <button
              type="button"
              className="vl-chip"
              onClick={() => setResultsTab("selected")}
            >
              View contacts
            </button>
          )
        ) : (
          <button type="button" className="vl-chip" onClick={handleNewChat}>
            New pin
          </button>
        )}
      </header>

      {error && (
        <div
          className="px-4 text-sm"
          style={{
            color: "#b91c1c",
            background: "#fef2f2",
            margin: "0 1rem 0.5rem",
            padding: "0.75rem",
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col relative">
        <MessageList messages={messages} isStreaming={isLoading} />
        {showWelcome && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <ChatGlyph />
          </div>
        )}
      </div>

      {isLoading && lastIsUser && (
        <div className="px-5 py-2 text-sm italic" style={{ color: "var(--vl-muted)" }}>
          Thinking...
        </div>
      )}

      {(showWelcome || showFinderSuggestions) && (
        <div className="px-5 pb-3 flex flex-col items-start gap-2">
          {suggestions.map((s) => (
            <button key={s} type="button" className="vl-chip" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <ChatInput
        onSend={send}
        disabled={isLoading}
        placeholder={isFinder ? "Ask about these contacts..." : undefined}
      />
    </div>
  );
}
