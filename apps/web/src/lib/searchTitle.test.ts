import { describe, expect, it } from "vitest";
import { queryKey, searchTitle } from "./searchTitle";

describe("searchTitle", () => {
  it("builds a readable search label", () => {
    expect(
      searchTitle({
        company: "WestJet",
        role: "software engineering intern",
        city: "Calgary",
      })
    ).toBe("WestJet · software engineering intern · Calgary");
  });

  it("dedupes by query key", () => {
    const a = queryKey({ company: "WestJet", role: "swe", city: "Calgary" });
    const b = queryKey({ company: "westjet", role: "swe", city: "calgary" });
    expect(a).toBe(b);
  });
});
