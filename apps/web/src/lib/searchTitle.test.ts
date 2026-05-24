import { describe, expect, it } from "vitest";
import { queryKey, searchTitle } from "./searchTitle";

describe("searchTitle", () => {
  it("builds a readable search label", () => {
    expect(
      searchTitle({
        company: "WestJet",
        role: "software engineering intern",
        teamFocus: "platform",
        city: "Calgary",
        school: "UCalgary",
      })
    ).toBe("WestJet - software engineering intern - platform - Calgary - UCalgary");
  });

  it("dedupes by query key", () => {
    const a = queryKey({
      company: "WestJet",
      role: "swe",
      city: "Calgary",
      teamFocus: "Platform",
    });
    const b = queryKey({
      company: "westjet",
      role: "swe",
      city: "calgary",
      teamFocus: "platform",
    });
    expect(a).toBe(b);
  });

  it("treats team focus as a separate search dimension", () => {
    const platform = queryKey({
      company: "WestJet",
      role: "swe",
      city: "Calgary",
      teamFocus: "Platform",
    });
    const data = queryKey({
      company: "WestJet",
      role: "swe",
      city: "Calgary",
      teamFocus: "Data",
    });
    expect(platform).not.toBe(data);
  });
});
