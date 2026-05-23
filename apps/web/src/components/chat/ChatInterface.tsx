import type { UIMessage } from "ai";
import { useHermesStore } from "../../stores/hermesStore";
import {
  useHermesChat,
  WELCOME_MESSAGE,
  WELCOME_SUGGESTIONS,
} from "../../hooks/useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

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
        stroke="#B6C7CD"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}

export function ChatInterface() {
  const student = useHermesStore((s) => s.student);
  const selectedPerson = useHermesStore((s) => s.selectedPerson);
  const { uiMessages, isLoading, error, send, clearChat } = useHermesChat({
    student,
    selectedPerson,
  });

  const messages: UIMessage[] =
    uiMessages.length === 0 ? [WELCOME_MESSAGE] : uiMessages;
  const showWelcome = uiMessages.length === 0;
  const lastIsUser =
    uiMessages.length > 0 && uiMessages[uiMessages.length - 1]?.role === "user";

  return (
    <div data-testid="chat-interface" className="vl-tile flex flex-col h-full overflow-hidden">
      <header className="px-5 pt-5 pb-3 flex justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ margin: 0 }}>
            Outreach Coach
          </h1>
          <p className="text-sm" style={{ color: "var(--vl-muted)", margin: "4px 0 0" }}>
            {selectedPerson
              ? `Targeting ${selectedPerson.name} at ${selectedPerson.company}`
              : "Select someone in People Finder"}
          </p>
        </div>
        <button type="button" className="vl-chip" onClick={clearChat}>
          New chat
        </button>
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
        <MessageList messages={messages} />
        {showWelcome && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <ChatGlyph />
          </div>
        )}
      </div>

      {isLoading && lastIsUser && (
        <div className="px-5 py-2 text-sm italic" style={{ color: "var(--vl-muted)" }}>
          Thinking…
        </div>
      )}

      {showWelcome && (
        <div className="px-5 pb-3 flex flex-col items-start gap-2">
          {WELCOME_SUGGESTIONS.map((s) => (
            <button key={s} type="button" className="vl-chip" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <ChatInput onSend={send} disabled={isLoading} />
    </div>
  );
}
