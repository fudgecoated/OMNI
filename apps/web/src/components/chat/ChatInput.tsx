import { useEffect, useRef, useState } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled,
  placeholder = "Ask Hermes about outreach…",
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
    <div className="p-4">
      <div
        className="flex items-end gap-2"
        style={{
          borderRadius: 999,
          padding: "6px 6px 6px 16px",
          backgroundColor: "var(--vl-tile)",
          border: "1px solid var(--vl-border)",
        }}
      >
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
          style={{
            border: "none",
            outline: "none",
            resize: "none",
            background: "transparent",
            color: "var(--vl-text)",
            padding: "8px 0",
          }}
        />
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          className="text-sm"
          style={{
            borderRadius: 999,
            padding: "8px 20px",
            border: "none",
            color: "white",
            backgroundColor: canSend ? "var(--vl-accent)" : "#a9c0e8",
            cursor: canSend ? "pointer" : "not-allowed",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
