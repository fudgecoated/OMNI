import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { MessageBubble } from "./MessageBubble";

interface Props {
  messages: UIMessage[];
}

export function MessageList({ messages }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages]);

  return (
    <div data-testid="message-list" className="flex-1 overflow-y-auto p-4 flex flex-col">
      <div className="flex-1">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`my-2 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <MessageBubble message={message} />
          </div>
        ))}
      </div>
      <div ref={endRef} />
    </div>
  );
}
