import { describe, expect, it } from "vitest";

import { isSubjectType } from "../is-subject-type";

describe("isSubjectType", () => {
  it("returns true for valid subject types", () => {
    expect(isSubjectType("kanji")).toBe(true);
    expect(isSubjectType("radical")).toBe(true);
    expect(isSubjectType("vocabulary")).toBe(true);
  });

  it("returns false for invalid subject types", () => {
    expect(isSubjectType("invalid")).toBe(false);
    expect(isSubjectType("KANJI")).toBe(false);
    expect(isSubjectType("Radical")).toBe(false);
    expect(isSubjectType("vocab")).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isSubjectType(null)).toBe(false);
    expect(isSubjectType(undefined)).toBe(false);
    expect(isSubjectType(123)).toBe(false);
    expect(isSubjectType({})).toBe(false);
    expect(isSubjectType([])).toBe(false);
    expect(isSubjectType(true)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isSubjectType("")).toBe(false);
  });
});
