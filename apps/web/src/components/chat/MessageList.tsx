import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { MessageBubble } from "./MessageBubble";

interface Props {
  messages: UIMessage[];
  isStreaming?: boolean;
}

export function MessageList({ messages, isStreaming }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages]);

  return (
    <div data-testid="message-list" className="flex-1 overflow-y-auto flex flex-col message-list">
      <div className="flex-1">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`my-2 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <MessageBubble
              message={message}
              isStreaming={
                isStreaming &&
                index === messages.length - 1 &&
                message.role === "assistant"
              }
            />
          </div>
        ))}
      </div>
      <div ref={endRef} />
    </div>
  );
}
