import type { UIMessage } from "ai";

interface Props {
  message: UIMessage;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const text =
    message.parts
      ?.filter((p) => p.type === "text")
      .map((p) => ("text" in p ? p.text : ""))
      .join("") ?? "";

  return (
    <div
      data-testid="message-bubble"
      className={`message-bubble max-w-80p rounded-2xl px-4 py-3 ${isUser ? "self-end" : "self-start"}`}
      style={
        isUser
          ? { backgroundColor: "var(--vl-accent)", color: "white" }
          : {
              backgroundColor: "var(--vl-tile-soft)",
              color: "var(--vl-text)",
              border: "1px solid var(--vl-border)",
            }
      }
    >
      <div className="whitespace-pre-wrap text-sm">{text}</div>
    </div>
  );
}
