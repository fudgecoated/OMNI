import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatContactPicker } from "./ChatContactPicker";

interface Props {
  message: UIMessage;
  isStreaming?: boolean;
}

function messageText(message: UIMessage): string {
  return (
    message.parts
      ?.filter((p) => p.type === "text")
      .map((p) => ("text" in p ? p.text : ""))
      .join("") ?? ""
  );
}

export function MessageBubble({ message, isStreaming }: Props) {
  const isUser = message.role === "user";
  const text = messageText(message);

  return (
    <div
      data-testid="message-bubble"
      className={`message-bubble max-w-80p rounded-2xl px-4 py-3 ${
        isUser ? "message-bubble--user self-end" : "message-bubble--assistant self-start"
      }`}
      style={
        isUser
          ? { backgroundColor: "var(--vl-accent)", color: "#ffffff" }
          : {
              backgroundColor: "var(--vl-tile-soft)",
              color: "var(--vl-text)",
              border: "1px solid var(--vl-border)",
            }
      }
    >
      {isUser ? (
        <div className="whitespace-pre-wrap text-sm">{text}</div>
      ) : (
        <div
          className={`chat-markdown text-sm ${isStreaming ? "chat-markdown--streaming" : ""}`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {text}
          </ReactMarkdown>
          <ChatContactPicker messageText={text} disabled={isStreaming} />
        </div>
      )}
    </div>
  );
}
