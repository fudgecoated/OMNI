import { describe, expect, it } from "vitest";
import { sanitizeOutreachCopy } from "@hermes/shared";

describe("sanitizeOutreachCopy", () => {
  it("replaces en and em dashes with commas", () => {
    expect(sanitizeOutreachCopy("Hello — world")).toBe("Hello, world");
    expect(sanitizeOutreachCopy("A – B")).toBe("A, B");
  });

  it("preserves paragraph breaks", () => {
    expect(sanitizeOutreachCopy("Line one\n\nLine two")).toBe("Line one\n\nLine two");
  });
});
