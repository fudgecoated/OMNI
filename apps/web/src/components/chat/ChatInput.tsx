import { useEffect, useRef, useState } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled,
  placeholder = "Ask Weave about outreach...",
}: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const submit = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
    }
  };

  const canSend = !disabled && !!value.trim();

  return (
    <div className="chat-composer">
      <div className="chat-input-shell">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 text-sm"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          className={`text-sm chat-input-send ${canSend ? "chat-input-send--ready" : ""}`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
