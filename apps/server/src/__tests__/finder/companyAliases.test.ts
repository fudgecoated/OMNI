import { describe, it, expect } from "vitest";
import { resolveCompanySlug } from "../../finder/companyAliases";

describe("resolveCompanySlug", () => {
  it("maps common names", () => {
    expect(resolveCompanySlug("Google")).toBe("google");
    expect(resolveCompanySlug("AWS")).toBe("amazon");
    expect(resolveCompanySlug("Facebook")).toBe("meta");
  });

  it("returns null for unknown companies", () => {
    expect(resolveCompanySlug("Shopify")).toBeNull();
  });
});
