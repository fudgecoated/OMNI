import { describe, expect, it } from "vitest";
import type { UIMessage } from "ai";
import { conversationTitle } from "./conversationTitle";

describe("conversationTitle", () => {
  it("uses first user message as title", () => {
    const messages: UIMessage[] = [
      {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "software engineering roles at westjet in calgary" }],
      },
    ];
    expect(conversationTitle(messages)).toBe(
      "software engineering roles at westjet in c…"
    );
  });

  it("returns New chat when empty", () => {
    expect(conversationTitle([])).toBe("New chat");
  });
});
