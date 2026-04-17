import { describe, expect, it } from "vitest";

import { parseSlug } from "../parse-slug";

describe("parseSlug", () => {
  it("returns the string for valid non-empty strings", () => {
    expect(parseSlug("kanji")).toBe("kanji");
    expect(parseSlug("hello-world")).toBe("hello-world");
    expect(parseSlug("123")).toBe("123");
  });

  it("returns null for empty strings", () => {
    expect(parseSlug("")).toBeNull();
  });

  it("returns null for non-string values", () => {
    expect(parseSlug(null)).toBeNull();
    expect(parseSlug(undefined)).toBeNull();
    expect(parseSlug(123)).toBeNull();
    expect(parseSlug({})).toBeNull();
    expect(parseSlug([])).toBeNull();
    expect(parseSlug(true)).toBeNull();
  });

  it("accepts strings with special characters", () => {
    expect(parseSlug("日本語")).toBe("日本語");
    expect(parseSlug("test_slug")).toBe("test_slug");
    expect(parseSlug("test.slug")).toBe("test.slug");
  });

  it("accepts strings with whitespace", () => {
    expect(parseSlug(" ")).toBe(" ");
    expect(parseSlug("hello world")).toBe("hello world");
  });
});
