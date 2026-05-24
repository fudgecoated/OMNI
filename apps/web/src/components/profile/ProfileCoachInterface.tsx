import { useEffect, useMemo, useState } from "react";
import type { UIMessage } from "ai";
import { ChatInput } from "../chat/ChatInput";
import { MessageList } from "../chat/MessageList";
import {
  getProfileUpdatesFromMessages,
  PROFILE_SUGGESTIONS,
  PROFILE_WELCOME,
  useProfileChat,
} from "../../hooks/useProfileChat";
import { useProfileStore } from "../../stores/profileStore";
import { stripJsonBlocks } from "../../lib/parseJsonBlock";
import { SECTION_CONFIG } from "../../lib/sectionConfig";

const STORAGE_KEY = "hermes-profile-chat-v1";

function loadStoredMessages(): UIMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UIMessage[];
    return parsed.length ? parsed : [];
  } catch {
    return [];
  }
}

function stripJsonFromMessages(messages: UIMessage[]): UIMessage[] {
  return messages.map((msg) => ({
    ...msg,
    parts: msg.parts.map((part) =>
      part.type === "text"
        ? { ...part, text: stripJsonBlocks(part.text) }
        : part
    ),
  }));
}

export function ProfileCoachInterface() {
  const config = SECTION_CONFIG.profile;
  const [initial] = useState(loadStoredMessages);
  const { messages: rawMessages, isLoading, error, send } = useProfileChat(initial);
  const applyProfilePatch = useProfileStore((s) => s.applyProfilePatch);

  const persist = (next: UIMessage[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota */
    }
  };

  useEffect(() => {
    if (rawMessages.length > 0) persist(rawMessages);
  }, [rawMessages]);

  const messages: UIMessage[] =
    rawMessages.length === 0 ? [PROFILE_WELCOME] : rawMessages;
  const displayMessages = useMemo(() => stripJsonFromMessages(messages), [messages]);
  const showWelcome = rawMessages.length === 0;

  const pendingUpdates = useMemo(
    () => getProfileUpdatesFromMessages(rawMessages),
    [rawMessages]
  );

  const lastIsUser =
    rawMessages.length > 0 && rawMessages[rawMessages.length - 1]?.role === "user";

  const onApply = () => {
    if (!pendingUpdates) return;
    applyProfilePatch(pendingUpdates);
  };

  return (
    <div
      data-testid="profile-coach-interface"
      className="vl-tile flex flex-col h-full overflow-hidden"
    >
      <header className="hermes-panel-header">
        <h1 className="hermes-panel-header__title">{config.centerTitle}</h1>
        <p className="hermes-panel-header__subtitle">{config.centerSubtitle}</p>
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

      {pendingUpdates && !isLoading && (
        <div className="hermes-profile-chat__apply" style={{ margin: "0 1.25rem 0.5rem" }}>
          <span>Weave suggested profile updates.</span>
          <button type="button" className="vl-btn vl-btn--primary" onClick={onApply}>
            Apply to profile
          </button>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col">
        <MessageList messages={displayMessages} isStreaming={isLoading} />
      </div>

      {isLoading && lastIsUser && (
        <div className="px-5 py-2 text-sm italic" style={{ color: "var(--vl-muted)" }}>
          Thinking...
        </div>
      )}

      {showWelcome && (
        <div className="px-5 pb-3 flex flex-col items-start gap-2">
          {PROFILE_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className="vl-chip"
              disabled={isLoading}
              onClick={() => send(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <ChatInput
        onSend={send}
        disabled={isLoading}
        placeholder="Tell Weave about you..."
      />
    </div>
  );
}
