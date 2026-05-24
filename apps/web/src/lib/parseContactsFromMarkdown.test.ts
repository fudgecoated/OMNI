import { describe, expect, it } from "vitest";
import { parseContactsFromMarkdown } from "./parseContactsFromMarkdown";

describe("parseContactsFromMarkdown", () => {
  it("parses markdown table rows with LinkedIn links", () => {
    const text = `🎯 WestJet — Software Engineering Contacts (Calgary)

| # | Name | Title | LinkedIn | Why Target |
| 1 | **Matthew Kanderka** | Senior Software Developer | [View Profile](https://www.linkedin.com/in/matthew-kanderka) | UCalgary alum |
| 2 | **Evan Brown** | Technical Lead | [Profile](https://linkedin.com/in/evan-brown-123) | Leadership |`;

    const contacts = parseContactsFromMarkdown(text);
    expect(contacts).toHaveLength(2);
    expect(contacts[0].name).toBe("Matthew Kanderka");
    expect(contacts[0].company).toContain("WestJet");
    expect(contacts[0].linkedinUrl).toContain("matthew-kanderka");
    expect(contacts[1].name).toBe("Evan Brown");
  });
});
